import { useParams } from "react-router";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  return <h1 className="text-2xl font-bold">Pedido #{orderId} confirmado</h1>;
}