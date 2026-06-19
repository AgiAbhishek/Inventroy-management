"""Run once to populate demo data: python -m app.db.seed"""
from app.db.session import SessionLocal
from app.models.product import Product
from app.models.customer import Customer


def seed():
    db = SessionLocal()
    try:
        if db.query(Product).count() > 0:
            return
        products = [
            Product(name="Mechanical Keyboard", sku="MK-001-BLK", price=149.99, quantity=42,
                    category="Peripherals", reorder_point=10, supplier="TechSource Inc."),
            Product(name="USB-C Cable 2m", sku="UC-002-2M", price=12.99, quantity=7,
                    category="Cables", reorder_point=20, supplier="CableWorks Ltd."),
            Product(name='4K Monitor 27"', sku="MN-003-4K", price=429.99, quantity=18,
                    category="Displays", reorder_point=5, supplier="ViewTech Corp."),
            Product(name="Wireless Mouse", sku="WM-004-GRY", price=59.99, quantity=5,
                    category="Peripherals", reorder_point=10, supplier="TechSource Inc."),
            Product(name="Laptop Stand", sku="LS-005-ALU", price=39.99, quantity=31,
                    category="Accessories", reorder_point=8, supplier="ErgoCo."),
        ]
        customers = [
            Customer(full_name="Acme Corporation", email="orders@acme.com", phone="555-0101"),
            Customer(full_name="Globex Solutions", email="purchasing@globex.com", phone="555-0102"),
            Customer(full_name="Initech Systems", email="it@initech.com", phone="555-0103"),
        ]
        db.add_all(products + customers)
        db.commit()
        print("Seeded demo data.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
