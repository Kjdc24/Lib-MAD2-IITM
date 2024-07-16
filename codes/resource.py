from flask_restful import Resource, Api, reqparse, fields, marshal_with
from codes.models import Request, db

api = Api(prefix='/api')
parser = reqparse.RequestParser()

request_fields = {
    'id': fields.Integer,
    'book_id': fields.Integer,
    'user_id': fields.Integer,
    'is_approved': fields.Boolean,
    'revoked': fields.Boolean
}

class RequestResource(Resource):
    @marshal_with(request_fields)
    def get(self):
        all_requests = Request.query.all()
        return all_requests

    def post(self):
        args = parser.parse_args()
        request = Request(**args)
        db.session.add(request)
        db.session.commit()
        return {"message": "Request has been created"}

api.add_resource(RequestResource, '/request')
