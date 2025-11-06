from flask import request, jsonify
from models import db, Company
def register_admin_routes(app):
    @app.route('/api/admin/add_company', methods=['POST'])
    def add_company():
        data = request.json or {}
        name = data.get('name'); source = data.get('source'); source_type = data.get('source_type')
        if not name or not source: return jsonify({'error':'missing'}), 400
        if Company.query.filter_by(name=name).first(): return jsonify({'error':'exists'}), 400
        c = Company(name=name, source=source, source_type=source_type)
        db.session.add(c); db.session.commit()
        return jsonify({'id':c.id,'name':c.name})
