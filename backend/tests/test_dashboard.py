def test_dashboard_summary(client):
    # Add products, customers, orders
    p1 = client.post("/products", json={"name": "A", "sku": "A-1", "price": 5.0, "quantity": 5}).json()
    client.post("/products", json={"name": "B", "sku": "B-1", "price": 5.0, "quantity": 100})
    c = client.post("/customers", json={"full_name": "X", "email": "x@x.com"}).json()
    client.post("/orders", json={
        "customer_id": c["id"],
        "items": [{"product_id": p1["id"], "quantity": 1}],
    })

    r = client.get("/dashboard/summary")
    assert r.status_code == 200
    data = r.json()
    assert data["total_products"] == 2
    assert data["total_customers"] == 1
    assert data["total_orders"] == 1
    # p1 has quantity=4 after order (<=10 threshold), p2 has 100 — only p1 is low stock
    skus = [p["sku"] for p in data["low_stock_products"]]
    assert "A-1" in skus
    assert "B-1" not in skus
