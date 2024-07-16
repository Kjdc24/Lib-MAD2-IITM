class Config(object):
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI= "sqlite:///dev.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'kjdcnksjdnckjndckjndcjnkdjcnkjdncjkdncjkdncjkn'
    SECURITY_PASSWORD_SALT = 'kjsdnckjsndckjsndckjsndckjsndc'
    SECURITY_EMAIL_SENDER = 'noreply@library.com'
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'your-email@gmail.com'
    MAIL_PASSWORD = 'your-email-password'
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SINGLE_HASH = 'plaintext'