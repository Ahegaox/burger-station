import logging
from decimal import Decimal
from html import escape

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app.config import settings
from app.models import Order, User

logger = logging.getLogger(__name__)


def _money(value: Decimal) -> str:
    return f"${value:.2f}"


def build_order_email(order: Order, user: User) -> tuple[str, str]:
    rows = []
    for item in order.items:
        options = ", ".join(
            escape(option.product_name)
            + (f" (+{_money(option.price)})" if option.price > 0 else "")
            for option in item.options
        )
        options_html = f"<br><small style='color:#777'>{options}</small>" if options else ""

        rows.append(f"""
            <tr>
              <td style="padding:8px;border-bottom:1px solid #eee">{escape(item.product_name)}{options_html}</td>
              <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">{item.quantity}</td>
              <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">{_money(item.unit_price)}</td>
              <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">{_money(item.subtotal)}</td>
            </tr>""")

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333">
      <h1 style="color:#e85d04">¡Gracias por tu pedido, {escape(user.name)}!</h1>
      <p>Hemos recibido tu pedido <strong>#{order.id}</strong>. Este es el resumen:</p>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f8f8f8">
            <th style="padding:8px;text-align:left">Producto</th>
            <th style="padding:8px">Cant.</th>
            <th style="padding:8px;text-align:right">Precio unit.</th>
            <th style="padding:8px;text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>{"".join(rows)}</tbody>
      </table>
      <p style="text-align:right;font-size:18px"><strong>Total: {_money(order.total)}</strong></p>
      <p>¡Buen provecho!<br>The Burger Station</p>
    </div>
    """

    subject = f"Tu pedido #{order.id} en The Burger Station"
    return subject, html


def send_email(to_email: str, subject: str, html: str) -> None:
    if not settings.sendgrid_api_key or not settings.sendgrid_from_email:
        logger.warning("SendGrid no está configurado: no se envía el email a %s", to_email)
        return

    message = Mail(
        from_email=settings.sendgrid_from_email,
        to_emails=to_email,
        subject=subject,
        html_content=html,
    )
    try:
        response = SendGridAPIClient(settings.sendgrid_api_key).send(message)
        logger.info("Email enviado a %s (status %s)", to_email, response.status_code)
    except Exception:
        logger.exception("Error al enviar el email a %s", to_email)