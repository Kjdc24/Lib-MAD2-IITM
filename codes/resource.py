from flask_restful import Resource, Api, reqparse, fields, marshal_with
from codes.models import User, db

api = Api(prefix='/api')
parser = reqparse.RequestParser()
