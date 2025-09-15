<?php

namespace App\Enums;

enum ActivityLogActionEnum: string
{
    case CREATE_PRODUCT = 'create_product';
    case VIEW_PRODUCT = 'view_product';
    case UPDATE_PRODUCT = 'update_product';
    case DELETE_PRODUCT = 'delete_product';
    case CREATE_PRODUCT_CATEGORY = 'create_product_category';
    case VIEW_PRODUCT_CATEGORY = 'view_product_category';
    case UPDATE_PRODUCT_CATEGORY = 'update_product_category';
    case DELETE_PRODUCT_CATEGORY = 'delete_product_category';
    case CREATE_SUPPLIER = 'create_supplier';
    case VIEW_SUPPLIER = 'view_supplier';
    case UPDATE_SUPPLIER = 'update_supplier';
    case DELETE_SUPPLIER = 'delete_supplier';
    case CREATE_TRANSACTION = 'create_transaction';
    case VIEW_TRANSACTION = 'view_transaction';
    case REFUND_TRANSACTION = 'refund_transaction';
    case VIEW_DASHBOARD = 'view_dashboard';
    case VIEW_ACTIVITY_LOG = 'view_activity_log';
    case LOGIN = 'login';
    case LOGOUT = 'logout';
    case VIEW_USER = 'view_user';
    case CREATE_USER = 'create_user';
    case UPDATE_USER = 'update_user';
    case VIEW_INVOICE = 'view_invoice';
    case DOWNLOAD_INVOICE = 'download_invoice';
    case PREVIEW_INVOICE = 'preview_invoice';
    case VIEW_CUSTOMER = 'view_customer';
    case UPDATE_CUSTOMER = 'update_customer';
    case DELETE_CUSTOMER = 'delete_customer';
    case VIEW_COMPANY = 'view_company';
    case EDIT_COMPANY = "edit_company";
}
