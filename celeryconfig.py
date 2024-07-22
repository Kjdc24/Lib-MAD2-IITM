# celeryconfig.py
CELERY_BROKER_URL = 'redis://localhost:6379/1'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/2'
CELERY_TIMEZONE = 'Asia/Kolkata'
BROKER_CONNECTION_RETRY_ON_STARTUP = True
