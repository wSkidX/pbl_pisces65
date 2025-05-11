import os
import subprocess

# List service directories
services = [
    ('auth-service', 'auth-service'),
    ('jadwal-service', 'jadwal-service'),
    ('sensor-service', 'sensor-service'),
    ('api-gateway', 'api-gateway'),
]

# Input Docker Hub username dan tag
username = input('Masukkan username Docker Hub: ').strip()
tag = input('Masukkan tag image (misal: latest): ').srip()
if not tag:
    print('Tag image tidak boleh kosong!')
    exit(1)

for folder, imagename in services:
    full_image = f"{username}/{imagename}:{tag}"
    service_path = os.path.join('services', folder)
    print(f"\n=== Build {imagename} ===")
    subprocess.run(["docker", "build", "-t", full_image, "."], cwd=service_path, check=True)
    print(f"\n=== Push {full_image} ===")
    subprocess.run(["docker", "push", full_image], check=True)

print("\nSelesai! Semua image sudah di-push ke Docker Hub.")
