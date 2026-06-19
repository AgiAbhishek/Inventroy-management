def test_create_product(client):
    r = client.post("/products", json={"name": "Widget", "sku": "W-001", "price": 9.99, "quantity": 100})
    assert r.status_code == 201
    data = r.json()
    assert data["sku"] == "W-001"
    assert data["quantity"] == 100


def test_create_product_duplicate_sku(client):
    payload = {"name": "Widget", "sku": "W-001", "price": 9.99, "quantity": 10}
    client.post("/products", json=payload)
    r = client.post("/products", json=payload)
    assert r.status_code == 409
    assert "SKU" in r.json()["detail"]


def test_list_products(client):
    client.post("/products", json={"name": "A", "sku": "A-1", "price": 1.0, "quantity": 5})
    client.post("/products", json={"name": "B", "sku": "B-1", "price": 2.0, "quantity": 5})
    r = client.get("/products")
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_get_product_not_found(client):
    r = client.get("/products/999")
    assert r.status_code == 404


def test_update_product(client):
    r = client.post("/products", json={"name": "A", "sku": "A-1", "price": 1.0, "quantity": 5})
    pid = r.json()["id"]
    r = client.put(f"/products/{pid}", json={"price": 2.5})
    assert r.status_code == 200
    assert float(r.json()["price"]) == 2.5


def test_delete_product(client):
    r = client.post("/products", json={"name": "A", "sku": "A-1", "price": 1.0, "quantity": 5})
    pid = r.json()["id"]
    assert client.delete(f"/products/{pid}").status_code == 204
    assert client.get(f"/products/{pid}").status_code == 404


def test_product_negative_quantity_rejected(client):
    r = client.post("/products", json={"name": "Bad", "sku": "BAD-1", "price": 1.0, "quantity": -1})
    assert r.status_code == 422
