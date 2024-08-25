from django.db import models
from InventoryServices.models import Warehouse
from UserServices.models import Users


class PurchaseOrder(models.Model):
    id=models.AutoField(primary_key=True)
    warehouse_id=models.ForeignKey('InventoryServices.Warehouse',on_delete=models.CASCADE,related_name='warehouse_id')
    supplier_id=models.ForeignKey(Users,on_delete=models.CASCADE,related_name='supplier_id')
    last_updated_by_user_id=models.ForeignKey(Users,on_delete=models.CASCADE,blank=True,null=True,related_name='last_updated_by_user_id_purchase_order')
    po_code=models.CharField(max_length=255)
    po_date=models.DateTimeField()
    expected_delivery_date=models.DateTimeField()
    payment_terms=models.CharField(max_length=255,choices=[('CASH','CASH'),('CREDIT','CREDIT'),('ONLINE','ONLINE'),('CHEQUE','CHEQUE')],default='CASH')
    payment_status=models.CharField(max_length=255,choices=[('PAID','PAID'),('UNPAID','UNPAID'),('PARTIAL PAID','PARTIAL PAID'),('CANCELLED','CANCELLED')],default='UNPAID')
    total_amount=models.DecimalField(max_digits=10,decimal_places=2)
    paid_amount=models.DecimalField(max_digits=10,decimal_places=2)
    due_amount=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    discount_amount=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    discount_type=models.CharField(max_length=255,choices=[('PERCENTAGE','PERCENTAGE'),('AMOUNT','AMOUNT'),('NO DISCOUNT','NO DISCOUNT')],default='NO DISCOUNT')
    shipping_amount=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    shipping_type=models.CharField(max_length=255,choices=[('FREE','FREE'),('PAID','PAID')],default='FREE')
    shipping_tax_percentage=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    shipping_cancelled_amount=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    shipping_cancelled_tax_amount=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    additional_details=models.JSONField()
    status=models.CharField(max_length=255,choices=[('DRAFT','DRAFT'),('CREATED','CREATED'),('APPROVED','APPROVED'),('SENT','SENT'),('RECEIVED','RECEIVED'),('PARTIAL RECEIVED','PARTIAL RECEIVED'),('CANCELLED','CANCELLED'),('RETURNED','RETURNED')],default='DRAFT')
    created_by_user_id=models.ForeignKey(Users,on_delete=models.CASCADE,blank=True,null=True,related_name='created_by_user_id_purchase_order')
    updated_by_user_id=models.ForeignKey(Users,on_delete=models.CASCADE,blank=True,null=True,related_name='updated_by_user_id_purchase_order')
    domain_user_id=models.ForeignKey(Users,on_delete=models.CASCADE,blank=True,null=True,related_name='domain_user_id_purchase_order')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    approved_by_user_id=models.ForeignKey(Users,on_delete=models.CASCADE,blank=True,null=True,related_name='approved_by_user_id_purchase_order')
    approved_at=models.DateTimeField(null=True,blank=True)
    cancelled_by_user_id=models.ForeignKey(Users,on_delete=models.CASCADE,blank=True,null=True,related_name='cancelled_by_user_id_purchase_order')
    cancelled_at=models.DateTimeField(null=True,blank=True)
    cancelled_reason=models.TextField(null=True,blank=True)
    received_by_user_id=models.ForeignKey(Users,on_delete=models.CASCADE,blank=True,null=True,related_name='received_by_user_id_purchase_order')
    received_at=models.DateTimeField(null=True,blank=True)
    returned_by_user_id=models.ForeignKey(Users,on_delete=models.CASCADE,blank=True,null=True,related_name='returned_by_user_id_purchase_order')
    returned_at=models.DateTimeField(null=True,blank=True)

    def defaultkey():
        return "po_code"
    
    def __str__(self) -> str:
        return str(self.po_code)

    class Meta:
        ordering = ('-created_date')
        
    