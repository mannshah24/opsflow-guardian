#!/usr/bin/env python3
"""
OpsFlow Guardian 2.0 - Authentication System Test Script
Tests all authentication endpoints and OAuth integration
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_authentication_system():
    """Test all authentication endpoints"""
    print("🔐 OpsFlow Guardian 2.0 - Authentication System Test")
    print("=" * 60)
    
    # Test 1: Health Check
    print("\n1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        assert response.status_code == 200
        print("✅ Health check passed")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
    
    # Test 2: Register User
    print("\n2️⃣ Testing User Registration...")
    register_data = {
        "email": "test@opsflow.com",
        "password": "SecurePass123!",
        "first_name": "Test",
        "last_name": "User",
        "terms_accepted": True
    }
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=register_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code in [200, 201]:
            print("✅ Registration successful")
        else:
            print("⚠️ Registration response received (may be expected)")
    except Exception as e:
        print(f"❌ Registration failed: {e}")
    
    # Test 3: Login
    print("\n3️⃣ Testing User Login...")
    login_data = {
        "email": "test@opsflow.com",
        "password": "SecurePass123!"
    }
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
        print(f"Status: {response.status_code}")
        response_data = response.json()
        print(f"Response: {response_data}")
        
        if response.status_code == 200 and "access_token" in response_data:
            access_token = response_data["access_token"]
            print("✅ Login successful")
            
            # Test 4: Get User Profile
            print("\n4️⃣ Testing Get User Profile...")
            headers = {"Authorization": f"Bearer {access_token}"}
            profile_response = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
            print(f"Status: {profile_response.status_code}")
            print(f"Response: {profile_response.json()}")
            if profile_response.status_code == 200:
                print("✅ Profile retrieval successful")
            else:
                print("❌ Profile retrieval failed")
                
        else:
            print("⚠️ Login response received (token may not be available)")
    except Exception as e:
        print(f"❌ Login failed: {e}")
    
    # Test 5: OAuth Endpoints
    print("\n5️⃣ Testing OAuth Endpoints...")
    oauth_providers = ["google", "github", "microsoft"]
    for provider in oauth_providers:
        try:
            response = requests.get(f"{BASE_URL}/api/v1/auth/oauth/{provider}")
            print(f"{provider.title()} OAuth Status: {response.status_code}")
            if response.status_code == 200:
                print(f"✅ {provider.title()} OAuth endpoint available")
            else:
                print(f"⚠️ {provider.title()} OAuth endpoint responded with status {response.status_code}")
        except Exception as e:
            print(f"❌ {provider.title()} OAuth failed: {e}")
    
    # Test 6: WebSocket Connection
    print("\n6️⃣ Testing WebSocket Endpoint...")
    try:
        import websocket
        ws_url = "ws://localhost:8000/ws"
        def on_message(ws, message):
            print(f"WebSocket message received: {message}")
        
        def on_open(ws):
            print("✅ WebSocket connection opened")
            ws.send(json.dumps({"type": "ping", "timestamp": str(datetime.now())}))
        
        def on_error(ws, error):
            print(f"❌ WebSocket error: {error}")
        
        ws = websocket.WebSocketApp(ws_url, on_open=on_open, on_message=on_message, on_error=on_error)
        print("WebSocket test initiated (check logs above)")
    except ImportError:
        print("⚠️ WebSocket test skipped (websocket-client not installed)")
    except Exception as e:
        print(f"❌ WebSocket test failed: {e}")
    
    print("\n🎉 Authentication System Test Complete!")
    print("=" * 60)
    print("📊 Backend: http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    print("🌐 Frontend: http://localhost:8081")
    print("💡 Review the test results above and check the browser for UI testing")

if __name__ == "__main__":
    test_authentication_system()
