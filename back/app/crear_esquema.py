"""
Esquema de base de datos – Prometeo
Modo: SQLAlchemy Core (tablas explícitas, sin ORM declarativo)
"""

from sqlalchemy import (
    MetaData, Table, Column,
    Integer, String, DECIMAL, DateTime,
    Boolean, Enum, Text, ForeignKey, UniqueConstraint, Index
)
from sqlalchemy.dialects.mysql import LONGTEXT

metadata = MetaData()

# ======================================================
# 1) TABLAS PARA CONTROL DE ACCESO (RBAC)
# ======================================================

modules = Table(
    "modules", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(50), nullable=False, unique=True, index=True),
    Column("description", String(100)),
)

profiles = Table(
    "profiles", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(50), nullable=False, unique=True, index=True),
    Column("description", String(100)),
)

permissions = Table(
    "permissions", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("profile_id", Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
    Column("module_id", Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False),
    Column("can_access", Boolean, nullable=False, server_default="0"),
    Column("can_add", Boolean, nullable=False, server_default="0"),
    Column("can_edit", Boolean, nullable=False, server_default="0"),
    Column("can_delete", Boolean, nullable=False, server_default="0"),
    UniqueConstraint("profile_id", "module_id", name="uq_permissions_profile_module"),
)

users = Table(
    "users", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("profile_id", Integer, ForeignKey("profiles.id"), nullable=False, index=True),
    Column("username", String(20), nullable=False, unique=True, index=True),
    Column("first_name", String(20), nullable=False),
    Column("last_name", String(100), nullable=False),
    Column("email", String(60), nullable=False, unique=True),
    Column("hashed_password", String(200), nullable=False),
)

# ======================================================
# 2) TABLAS DE NEGOCIO
# ======================================================

chart_of_accounts = Table(
    "chart_of_accounts", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("account", String(20), nullable=False, unique=True),
    Column("description", String(100)),
)

expense_types = Table(
    "expense_types", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("expense_type", String(100), nullable=False, unique=True),
)

expense_details = Table(
    "expense_details", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("expense_type_id", Integer, ForeignKey("expense_types.id"), nullable=False, index=True),
    Column("code", String(10), nullable=False),
    Column("description", String(100)),
    Column("chart_account_id", Integer, ForeignKey("chart_of_accounts.id"), nullable=False, index=True),
    UniqueConstraint("code", name="uq_expense_details_code"),
)

product_catalog = Table(
    "product_catalog", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("item", String(30), nullable=False, unique=True, index=True),
    Column("description", String(80)),
    Column("tariff_code", String(15)),
    Column("duty_ciu", DECIMAL(8, 2)),
    Column("duty_us", DECIMAL(8, 2)),
    Column("comments", String(250)),
    Column("sat_product_code", String(15)),
    Column("sat_code_description", String(100)),
    Column("sat_unit", String(3)),
    Column("sat_unit_description", String(100)),
)

bank_accounts = Table(
    "bank_accounts", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("bank", String(60), nullable=False),
    Column("account_number", String(20), nullable=False),
    Column("currency", String(5)),
    Column("chart_account_id", Integer, ForeignKey("chart_of_accounts.id"), nullable=False, index=True),
)

financial_operations = Table(
    "financial_operations", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("po_id", Integer, ForeignKey("purchase_orders.id"), nullable=True),
    Column("bank_id", Integer, ForeignKey("bank_accounts.id"), nullable=True, index=True),
    Column("operation_type", Enum("Income", "Expense"), nullable=False),
    Column("date", DateTime, nullable=False),
    Column("concept", String(150)),
    Column("reference", String(60)),
    Column("amount", DECIMAL(14, 2), nullable=False),
    Column("invoice_id", Integer, ForeignKey("invoices.id"), nullable=True),
)

import_declarations = Table(
    "import_declarations", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("date", DateTime, nullable=False),
    Column("visa_reference", String(30)),
    Column("number", String(20), nullable=False, unique=True),
)

purchase_orders = Table(
    "purchase_orders", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("po_number", String(20), nullable=False, unique=True),
    Column("date", DateTime, nullable=False),
    Column("product_id", Integer, ForeignKey("product_catalog.id"), nullable=False),
    Column("weight", Integer),
    Column("import_declaration_id", Integer, ForeignKey("import_declarations.id")),
)

invoices = Table(
    "invoices", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("po_id", Integer, ForeignKey("purchase_orders.id")),
    Column("file_name", String(255), nullable=False),
    Column("file_extension", String(5), nullable=False),
    Column("file_base64", LONGTEXT),
    Column("file_json", Text),
    Column("visa_description", String(100)),
    Column("client_reference", String(60)),
    Column("date", DateTime, nullable=False),
    Column("import_declaration_id", Integer, ForeignKey("import_declarations.id")),
    Column("supplier", String(60)),
    Column("containers", String(30)),
    Column("expense_detail_id", Integer, ForeignKey("expense_details.id"), nullable=False),
    UniqueConstraint("file_name", "file_extension", name="uq_invoices_file"),
)

cg_invoice = Table(
    "cg_invoice", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("fo_egress_id", Integer, ForeignKey("financial_operations.id")),
    Column("fo_income_id", Integer, ForeignKey("financial_operations.id")),
    Column("po_id", Integer, ForeignKey("purchase_orders.id")),
    Column("date", DateTime, nullable=False),
    Column("invoice_folio", String(20)),
    Column("invoice_amount", DECIMAL(14, 2), nullable=False),
    Column("cg_total", DECIMAL(14, 2), nullable=False),
    Column("advance_payment", DECIMAL(14, 2)),
    Column("refund", DECIMAL(14, 2)),
    Column("cg_status", Enum("Open", "Closed"), nullable=False),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
)

cg_breakdown = Table(
    "cg_breakdown", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("detail_date", DateTime, nullable=False),
    Column("expense_detail_id", Integer, ForeignKey("expense_details.id")),
    Column("code", String(10)),
    Column("description", String(100)),
    Column("expense_type", String(100)),
    Column("foreign_amount", DECIMAL(14, 2)),
    Column("amount", DECIMAL(14, 2), nullable=False),
    Column("balance_amount", DECIMAL(14, 2)),
    Column("invoice_folio", String(30)),
    Column("invoice_id", Integer, ForeignKey("invoices.id"), nullable=False, index=True),
    Column(
        "invoice_status",
        Enum("Matches", "DoesNotMatch", "Unidentified"),
        nullable=False,
        server_default="Unidentified",
    ),
    Column("approval_user_id", Integer, ForeignKey("users.id"), nullable=False),
)

# Índices útiles que no se crean automáticamente con FK
Index("ix_permissions_profile_module", permissions.c.profile_id, permissions.c.module_id)
