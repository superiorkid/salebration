"use client";

import { PermissionsEnum } from "@/enums/permissions";
import { useUpdateReceivedQuantity } from "@/hooks/tanstack/purchase-order-items";
import { usePermission } from "@/hooks/use-permission";
import { formatCurrency } from "@/lib/utils";
import { TPurchaseOrderItem } from "@/types/purchase-order";
import { ChangeEvent, useState } from "react";

interface PurchaseOrderItemRowProps {
  purchaseOrderItem: TPurchaseOrderItem;
  isOrderInReceivableState: boolean;
}

const PurchaseOrderItemRow = ({
  purchaseOrderItem,
  isOrderInReceivableState,
}: PurchaseOrderItemRowProps) => {
  const [receivedQuantity, setReceivedQuantity] = useState<number>(
    purchaseOrderItem.received_quantity,
  );

  const { isPending, updateReceivedQuantityMutation } =
    useUpdateReceivedQuantity();

  const handleReceivedQuantityChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setReceivedQuantity(Number(event.target.value));
  };

  const handleUpdateReceivedQuantity = () => {
    if (!isOrderInReceivableState) return;

    updateReceivedQuantityMutation({
      purchaseOrderItemId: purchaseOrderItem.id,
      receivedQuantity: receivedQuantity,
    });
  };

  const isAllReceived =
    purchaseOrderItem.quantity === purchaseOrderItem.received_quantity;

  const canUpdatePurchaseOrderReceivedItem = usePermission(
    PermissionsEnum.UPDATE_PO_ITEMS,
  );

  return (
    <tr key={purchaseOrderItem.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        {purchaseOrderItem.product_variant.product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {purchaseOrderItem.product_variant.value}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {purchaseOrderItem.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isOrderInReceivableState && canUpdatePurchaseOrderReceivedItem ? (
          <input
            type="number"
            min="0"
            max={purchaseOrderItem.quantity}
            defaultValue={purchaseOrderItem.received_quantity || 0}
            className="w-20 rounded border px-2 py-1"
            onChange={handleReceivedQuantityChange}
            disabled={isPending}
          />
        ) : (
          "0"
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {purchaseOrderItem.quantity -
          (purchaseOrderItem.received_quantity || 0)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {formatCurrency(purchaseOrderItem.unit_price)}
      </td>
      <td className="px-6 py-4 font-medium whitespace-nowrap">
        {formatCurrency(
          Number(purchaseOrderItem.quantity) *
            Number(purchaseOrderItem.unit_price),
        )}
      </td>
      {isOrderInReceivableState &&
        !isAllReceived &&
        canUpdatePurchaseOrderReceivedItem && (
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={handleUpdateReceivedQuantity}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </td>
        )}
    </tr>
  );
};

export default PurchaseOrderItemRow;
