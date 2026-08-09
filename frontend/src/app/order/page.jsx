import OrderContainer from "../../components/OrderContainer/OrderContainer.jsx";

export const metadata = {
  title: "Checkout & Order | Mont Blanc",
  description: "Place your gourmet food and Italian delicacy order online at Mont Blanc.",
};

export default function OrderPage() {
  return (
    <section className="section_catalog">
      <OrderContainer />
    </section>
  );
}
