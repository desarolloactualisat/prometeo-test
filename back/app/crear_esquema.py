from sqlalchemy import (
    MetaData, Table, Column,
    Integer, String, Float, DateTime,
    Boolean, Enum, Text, ForeignKey
)
from sqlalchemy.dialects.mysql import LONGTEXT

metadata = MetaData()

# ======================================================
# 1) TABLAS PARA CONTROL DE ACCESO (ENFOQUE 2: RBAC)
# ======================================================

# Módulos del sistema (por ejemplo: "Facturación", "Compras", "Gastos", etc.)
modules = Table(
    "modules", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(50), nullable=False),     # Ej: "facturacion", "compras"
    Column("description", String(100), nullable=True)
)

# Perfiles (roles) que agrupan permisos para uno o varios módulos
profiles = Table(
    "profiles", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(50), nullable=False),    # Ej: "Administrador", "Contador"
    Column("description", String(100), nullable=True)
)

# Permisos: asocian un perfil con un módulo y sus acciones permitidas
permissions = Table(
    "permissions", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("profile_id", Integer, ForeignKey("profiles.id"), nullable=False),
    Column("module_id", Integer, ForeignKey("modules.id"), nullable=False),
    Column("can_access", Boolean, nullable=False, default=False),
    Column("can_add", Boolean, nullable=False, default=False),
    Column("can_edit", Boolean, nullable=False, default=False),
    Column("can_delete", Boolean, nullable=False, default=False),
)

# Usuarios, cada uno asociado a un perfil
users = Table(
    "users", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("profile_id", Integer, ForeignKey("profiles.id"), nullable=False),
    Column("username", String(20), nullable=False),
    Column("first_name", String(20), nullable=False),
    Column("last_name", String(100), nullable=False),
    Column("email", String(60), nullable=False),
    Column("password", String(200), nullable=False),
    # Podrías agregar 'password', 'status', etc.
)

# ======================================================
# 2) TABLAS DE NEGOCIO (SIN "module_id" EN CADA UNA)
# ======================================================

# Tabla de cuentas contables (antes "cuentas_contables")
chart_of_accounts = Table(
    "chart_of_accounts", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("account", String(20), nullable=False),
    Column("description", String(100), nullable=True),
)

# Tabla de tipos de gastos (antes "tipos_gastos")
expense_types = Table(
    "expense_types", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("expense_type", String(100), nullable=False),
)

# Detalle de gastos (antes "detalle_gastos")
expense_details = Table(
    "expense_details", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("expense_type_id", Integer, ForeignKey("expense_types.id"), nullable=False),
    Column("code", String(10), nullable=False),          # Antes "Clave"
    Column("description", String(100), nullable=True),   # Antes "Descripcion"
    Column("account_id", Integer, ForeignKey("chart_of_accounts.id"), nullable=False),
)

# Catálogo de productos (antes "catalogo_productos")
product_catalog = Table(
    "product_catalog", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("item", String(30), nullable=False),
    Column("description", String(80), nullable=True),
    Column("tariff_code", String(15), nullable=True),
    Column("duty_ciu", Float, nullable=True),
    Column("duty_us", Float, nullable=True),
    Column("comments", String(250), nullable=True),
    Column("sat_product_code", String(15), nullable=True),       # CveProdSAT
    Column("sat_code_description", String(100), nullable=True),  # DescCveSAT
    Column("sat_unit", String(3), nullable=True),                # UnidadSAT
    Column("sat_unit_description", String(100), nullable=True),  # DesUnidadSAT
)

# Cuentas bancarias (antes "cuentas_bancarias")
bank_accounts = Table(
    "bank_accounts", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("bank", String(60), nullable=False),           # Antes "Banco"
    Column("account_number", String(20), nullable=False),  # Antes "NumeroCuenta"
    Column("currency", String(5), nullable=True),          # Antes "Divisa"
    Column("account_id", Integer, ForeignKey("chart_of_accounts.id"), nullable=False),
)

# Operaciones financieras (antes "document_financial_operation")
# Se cambiaron a Enum("Income", "Expense") en lugar de ("Ingresos", "Egresos")
financial_operations = Table(
    "financial_operations", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("po_id", Integer, nullable=True),   # IdPO (FK a purchase_orders, si corresponde)
    Column("bank_id", Integer, ForeignKey("bank_accounts.id"), nullable=True),
    Column("operation_type", Enum("Income", "Expense"), nullable=False),
    Column("date", DateTime, nullable=False),
    Column("concept", String(150), nullable=True),
    Column("reference", String(60), nullable=True),
    Column("amount", Float, nullable=False),
    Column("invoice_id", Integer, nullable=True),  # rel. a "invoices"? Depende de tu modelo
)

# Comprobantes (antes "comprobantes"), renombrados a 'invoices'
invoices = Table(
    "invoices", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("po_id", Integer, nullable=True),  # (FK a purchase_orders, si aplica)
    Column("file_name", String(255), nullable=False),
    Column("file_extension", String(5), nullable=False),
    Column("file_base64", LONGTEXT, nullable=True),
    Column("file_json", Text, nullable=True),
    Column("visa_description", String(100), nullable=True),
    Column("client_reference", String(60), nullable=True),
    Column("date", DateTime, nullable=False),
    Column("customs_document_id", Integer, nullable=True),  # (FK a customs_documents)
    Column("supplier", String(60), nullable=True),
    Column("containers", String(30), nullable=True),
    Column("expense_detail_id", Integer, ForeignKey("expense_details.id"), nullable=False),
)

# Órdenes de compra (antes "documento_purchaseorder")
purchase_orders = Table(
    "purchase_orders", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("fo_id", Integer, ForeignKey("financial_operations.id"), nullable=True),  # si aplica
    Column("po_number", String(10), nullable=False),  # antes No_PO
    Column("date", DateTime, nullable=False),
    Column("product_id", Integer, ForeignKey("product_catalog.id"), nullable=False),
    Column("weight", Integer, nullable=True),
    Column("customs_document_id", Integer, nullable=True),  # (FK a customs_documents)
)

# Pedimentos / documentos aduanales (antes "pedimentos")
import_declaration = Table(
    "import_declaration", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("date", DateTime, nullable=False),
    Column("visa_reference", String(30), nullable=True),
    Column("customs_document", String(20), nullable=False),
)

# Factura CG (antes "factura_cg")
cg_invoice = Table(
    "cg_invoice", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("fo_egress_id", Integer, ForeignKey("financial_operations.id"), nullable=True),
    Column("fo_income_id", Integer, ForeignKey("financial_operations.id"), nullable=True),
    Column("po_id", Integer, ForeignKey("purchase_orders.id"), nullable=True),
    Column("date", DateTime, nullable=False),
    Column("invoice_folio", String(10), nullable=True),
    Column("invoice_amount", Float, nullable=False),
    Column("cg_total", Float, nullable=False),
    Column("advance_payment", Float, nullable=True),
    Column("refund", Float, nullable=True),
    Column("cg_status", Enum("Open", "Closed"), nullable=False),  # Antes "Abierta", "Cerrada"
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
)

# Desglose CG (antes "desglose_cg")
cg_breakdown = Table(
    "cg_breakdown", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("detail_date", DateTime, nullable=False),        # FechaDetalle
    Column("expense_detail_id", Integer, ForeignKey("expense_details.id"), nullable=True),
    Column("code", String(10), nullable=True),              # Clave
    Column("description", String(100), nullable=True),      # Descripcion
    Column("expense_type", String(100), nullable=True),     # TipoGasto
    Column("foreign_amount", Float, nullable=True),         # ImporteME (moneda extranjera)
    Column("amount", Float, nullable=False),                # Importe
    Column("balance_amount", Float, nullable=True),         # ImporteCG_Saldo
    Column("invoice_folio", String(30), nullable=True),
    Column("invoice_id", Integer, ForeignKey("invoices.id"), nullable=False),
    Column(
        "invoice_status",
        Enum("Matches", "DoesNotMatch", "Unidentified"),    # "Cuadra", "No Cuadra", "No Identificado"
        nullable=False
    ),
    Column("approval_user_id", Integer, ForeignKey("users.id"), nullable=False),
)
