from app import create_app
import json
def test_health():
    app = create_app()
    client = app.test_client()
    rv = client.get('/health')
    assert rv.status_code == 200
    data = json.loads(rv.data)
    assert data.get('status') == 'ok'
