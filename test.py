import smtplib

def send_email():
    smtp_host = 'localhost'
    smtp_port = 1025
    sender = 'your-email@example.com'
    recipient = 'recipient@example.com'
    subject = 'Test Email'
    body = 'This is a test email from MailHog.'

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        message = f'Subject: {subject}\n\n{body}'
        server.sendmail(sender, recipient, message)

send_email()














def make_celery(app):
    celery = Celery(
        app.import_name,
        broker=app.config['CELERY_BROKER_URL'],
        backend=app.config['CELERY_RESULT_BACKEND']
    )
    celery.conf.update(
        result_backend=app.config['CELERY_RESULT_BACKEND'],
        timezone=app.config['CELERY_TIMEZONE']
    )
    return celery

celery_app = make_celery(app)

# Email sending function
def send_email(to_email, subject, body, attachment=None, attachment_filename=None):
    msg = MIMEMultipart()
    msg['From'] = app.config['SENDER_EMAIL']
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    if attachment:
        part = MIMEApplication(attachment, Name=attachment_filename)
        part['Content-Disposition'] = f'attachment; filename="{attachment_filename}"'
        msg.attach(part)

    try:
        with smtplib.SMTP(app.config['SMTP_HOST'], app.config['SMTP_PORT']) as server:
            server.send_message(msg)
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

@celery_app.task(name='app.export_all_requests_to_csv')
def export_all_requests_to_csv():
    try:
        print("Starting task export_all_requests_to_csv")
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Book Title', 'User Email', 'Approved', 'Date Requested', 'Return Date'])

        requests = Request.query.all()
        for request in requests:
            writer.writerow([
                request.book_title,
                request.user_email,
                'Yes' if request.is_approved else 'No',
                request.date_requested,
                request.date_return
            ])
        output.seek(0)
        send_export_email('kj@email.com', output.getvalue())  # Replace with the admin email
        print("Task export_all_requests_to_csv completed successfully")
    except Exception as e:
        print(f"Error in export_all_requests_to_csv: {e}")


def send_export_email(recipient_email, csv_data):
    subject = 'All Requests Export'
    body = 'Dear Admin,\n\nPlease find the attached CSV file containing all requests data.\n\nThank you.'
    send_email(recipient_email, subject, body, attachment=csv_data, attachment_filename='all_requests.csv')

@app.route('/export-all-requests', methods=['POST'])
def export_all_requests():
    # Trigger the Celery task
    export_all_requests_to_csv.delay()
    return jsonify({'message': 'Export request received. You will receive an email once the export is complete.'}), 200

# Celery tasks for reminders and reports (for completeness)
@celery_app.task
def send_daily_reminders():
    users = User.query.all()
    today = datetime.date.today()
    for user in users:
        requests = Request.query.filter_by(user_id=user.id, is_requested=True).all()
        for request in requests:
            if request.date_return and (request.date_return <= today + datetime.timedelta(days=1)):
                send_email_reminder(user.email, request.book_title)

def send_email_reminder(email, book_title):
    subject = "Reminder: Book Return Due"
    body = f"Dear User, \n\nThis is a reminder to return the book '{book_title}'. The due date is approaching. Please visit the library to return the book. \n\nThank you."
    send_email(email, subject, body)

@celery_app.task
def send_monthly_activity_report():
    report = generate_monthly_report()
    send_email_report('librarian@example.com', 'Monthly Activity Report', report)

def generate_monthly_report():
    today = datetime.date.today()
    first_day_of_current_month = today.replace(day=1)
    last_day_of_previous_month = first_day_of_current_month - datetime.timedelta(days=1)
    
    sections = Section.query.all()
    issued_books = Request.query.filter(Request.date_requested >= first_day_of_current_month).all()
    return_dates = Request.query.filter(Request.date_return >= first_day_of_current_month).all()

    report_data = {
        'sections': sections,
        'issued_books': issued_books,
        'return_dates': return_dates,
        'start_date': first_day_of_current_month,
        'end_date': last_day_of_previous_month,
    }
    # Render HTML template with the report data
    with open('report_template.html', 'r') as file:
        template = Template(file.read())
    return template.render(report_data)

def send_email_report(recipient, subject, html_content):
    msg = MIMEMultipart()
    msg['From'] = app.config['SENDER_EMAIL']
    msg['To'] = recipient
    msg['Subject'] = subject
    msg.attach(MIMEText(html_content, 'html'))
    send_email(recipient, subject, html_content)

# Schedule the Celery tasks using Celery Beat
from celery.schedules import crontab

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Executes every day at 6 PM
    sender.add_periodic_task(
        crontab(hour=18, minute=0),
        send_daily_reminders.s(),
    )
    # Executes at midnight on the first day of every month
    sender.add_periodic_task(
        crontab(day_of_month=1, hour=0, minute=0),
        send_monthly_activity_report.s(),
    )
