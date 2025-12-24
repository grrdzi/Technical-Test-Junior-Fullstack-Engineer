package dto

type PurchaseItemRequest struct {
	ItemID uint `json:"item_id"`
	Qty    int  `json:"qty"`
}

type CreatePurchaseRequest struct {
	SupplierID uint                  `json:"supplier_id"`
	Items      []PurchaseItemRequest `json:"items"`
}
