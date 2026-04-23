import pytest

def test_health_live(client):
    response = client.get("/api/v1/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "API is live"}

def test_health_ready(client):
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "API and Database are ready"}

def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_login_user(client):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_protected_route(client):
    # Get token first
    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    token = login_response.json()["access_token"]

    # Access protected route
    response = client.get(
        "/api/v1/test/protected",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "You are authenticated!" in response.json()["message"]
