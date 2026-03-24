# mostly AI-generated dummy data generator 

import sqlite3
import random
from faker import Faker
from datetime import datetime

fake = Faker('de_DE')

conn = sqlite3.connect('sqlite.db')
cursor = conn.cursor()

def get_timestamp(dt):
    return int(dt.timestamp() * 1000)

now = get_timestamp(datetime.now())

print("🌱 Seeding database with DHBW dummy data...")

# 1. Create Profiles (Landlords and Tenants)
profiles = []
for _ in range(30):
    role = random.choices(['tenant', 'landlord', 'both'], weights=[60, 30, 10])[0]
    cursor.execute(
        "INSERT INTO profiles (name, role, phone, \"dhbw-location\", \"work-location\", \"dhbw-course\", accept_wg, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (fake.name(), role, fake.phone_number(), "Karlsruhe", fake.city(), "WWI24B2", random.choice([0, 1]), now)
    )
    profiles.append((cursor.lastrowid, role))

landlords = [p[0] for p in profiles if p[1] in ['landlord', 'both']]
tenants = [p[0] for p in profiles if p[1] in ['tenant', 'both']]

# 2. Create Apartments
# Typical DHBW theory/practice phase blocks
rotation_dates = [
    (datetime(2026, 4, 1), datetime(2026, 6, 30)),
    (datetime(2026, 7, 1), datetime(2026, 9, 30)),
    (datetime(2026, 10, 1), datetime(2026, 12, 31)),
]

karlsruhe_districts = ["Südstadt", "Oststadt", "Weststadt", "Durlach", "Mühlburg"]

apartment_ids = []
for _ in range(50):
    landlord_id = random.choice(landlords)
    district = random.choice(karlsruhe_districts)
    street = fake.street_name()
    start_date, end_date = random.choice(rotation_dates)
    
    cursor.execute(
        """
        INSERT INTO apartments 
        (landlord_id, title, description, address, size, rent_price, available_from, available_to, "is-wg", created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            landlord_id,
            f"WG Zimmer in der {district}",
            fake.paragraph(nb_sentences=3),
            f"{street} {random.randint(1, 120)}, Karlsruhe",
            random.randint(12, 35), # size in sqm
            random.randint(350, 650), # rent price
            get_timestamp(start_date),
            get_timestamp(end_date),
            random.choice([0, 1]),
            now
        )
    )
    apartment_ids.append(cursor.lastrowid)

# 3. Create a few Requests
for _ in range(40):
    tenant_id = random.choice(tenants)
    apt_id = random.choice(apartment_ids)
    status = random.choice(['pending', 'accepted', 'rejected'])
    
    cursor.execute(
        "INSERT INTO requests (tenant_id, apartment_id, status, message, created_at) VALUES (?, ?, ?, ?, ?)",
        (tenant_id, apt_id, status, "Hi, is this room still available for the next theory phase?", now)
    )

conn.commit()
conn.close()

print(f"✅ Successfully inserted {len(profiles)} profiles, {len(apartment_ids)} apartments, and 40 requests!")
