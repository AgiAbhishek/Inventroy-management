def test_create_customer(client):
    r = client.post("/customers", json={"full_name": "Alice", "email": "alice@example.com", "phone": "555-0101"})
    assert r.status_code == 201
    assert r.json()["email"] == "alice@example.com"


def test_create_customer_duplicate_email(client):
    payload = {"full_name": "Alice", "email": "alice@example.com"}
    client.post("/customers", json=payload)
    r = client.post("/customers", json=payload)
    assert r.status_code == 409
    assert "email" in r.json()["detail"].lower()


def test_get_customer_not_found(client):
    r = client.get("/customers/999")
    assert r.status_code == 404


def test_delete_customer(client):
    r = client.post("/customers", json={"full_name": "Bob", "email": "bob@example.com"})
    cid = r.json()["id"]
    assert client.delete(f"/customers/{cid}").status_code == 204
    assert client.get(f"/customers/{cid}").status_code == 404


def test_invalid_email_rejected(client):
    r = client.post("/customers", json={"full_name": "Bad", "email": "not-an-email"})
    assert r.status_code == 422
