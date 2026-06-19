import pytest


def _create_product(client, sku="P-001", qty=20, price=10.0):
    r = client.post("/products", json={"name": "Test Product", "sku": sku, "price": price, "quantity": qty})
    assert r.status_code == 201
    return r.json()


def _create_customer(client, email="c@example.com"):
    r = client.post("/customers", json={"full_name": "Test Customer", "email": email})
    assert r.status_code == 201
    return r.json()


def test_create_order_reduces_stock(client):
    product = _create_product(client, qty=20)
    customer = _create_customer(client)

    r = client.post("/orders", json={
        "customer_id": customer["id"],
        "items": [{"product_id": product["id"], "quantity": 5}],
    })
    assert r.status_code == 201
    data = r.json()
    assert float(data["total_amount"]) == 50.0  # 5 * 10.0
    assert len(data["items"]) == 1

    updated_product = client.get(f"/products/{product['id']}").json()
    assert updated_product["quantity"] == 15  # 20 - 5


def test_create_order_insufficient_stock(client):
    product = _create_product(client, qty=3)
    customer = _create_customer(client)

    r = client.post("/orders", json={
        "customer_id": customer["id"],
        "items": [{"product_id": product["id"], "quantity": 10}],
    })
    assert r.status_code == 409
    assert "Insufficient stock" in r.json()["detail"]

    # Stock must be unchanged after failed order
    unchanged = client.get(f"/products/{product['id']}").json()
    assert unchanged["quantity"] == 3


def test_create_order_customer_not_found(client):
    product = _create_product(client)
    r = client.post("/orders", json={
        "customer_id": 9999,
        "items": [{"product_id": product["id"], "quantity": 1}],
    })
    assert r.status_code == 404


def test_create_order_product_not_found(client):
    customer = _create_customer(client)
    r = client.post("/orders", json={
        "customer_id": customer["id"],
        "items": [{"product_id": 9999, "quantity": 1}],
    })
    assert r.status_code == 404


def test_delete_order_restores_stock(client):
    product = _create_product(client, qty=20)
    customer = _create_customer(client)

    order_r = client.post("/orders", json={
        "customer_id": customer["id"],
        "items": [{"product_id": product["id"], "quantity": 7}],
    })
    order_id = order_r.json()["id"]

    client.delete(f"/orders/{order_id}")

    restored = client.get(f"/products/{product['id']}").json()
    assert restored["quantity"] == 20  # fully restored


def test_create_order_multi_item_total(client):
    p1 = _create_product(client, sku="P-001", qty=50, price=10.0)
    p2 = _create_product(client, sku="P-002", qty=50, price=5.0)
    customer = _create_customer(client)

    r = client.post("/orders", json={
        "customer_id": customer["id"],
        "items": [
            {"product_id": p1["id"], "quantity": 2},   # 20.0
            {"product_id": p2["id"], "quantity": 4},   # 20.0
        ],
    })
    assert r.status_code == 201
    assert float(r.json()["total_amount"]) == 40.0


def test_order_empty_items_rejected(client):
    customer = _create_customer(client)
    r = client.post("/orders", json={"customer_id": customer["id"], "items": []})
    assert r.status_code == 422


def test_get_order(client):
    product = _create_product(client)
    customer = _create_customer(client)
    r = client.post("/orders", json={
        "customer_id": customer["id"],
        "items": [{"product_id": product["id"], "quantity": 1}],
    })
    oid = r.json()["id"]
    r2 = client.get(f"/orders/{oid}")
    assert r2.status_code == 200
    assert r2.json()["id"] == oid


def test_get_order_not_found(client):
    assert client.get("/orders/9999").status_code == 404
