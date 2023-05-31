import ProductCard from "@/components/ProductCard";
import { getCookie } from "@/utils/serverAction";
import { redirect } from "next/navigation";

const getAllProducts = async () => {
  const cookie = await getCookie("auth_token");

  const res = await fetch("https://dummyjson.com/auth/products", {
    next: { revalidate: 0 },
    headers: {
      Authorization: `Bearer ${cookie?.value}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 200) {
    return res.json();
  } else {
    return null;
  }
};

export default async function ProductsPage() {
  const productsData = await getAllProducts();

  if (!productsData) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center ">
      <div className="mt-10 mb-20 flex flex-col gap-4 ">
        <h1 className="font-semibold text-3xl">All Products Page</h1>
        <div className="grid grid-cols-2 gap-3">
          {productsData?.products?.map((item: any) => (
            <ProductCard
              key={item?.id}
              id={item?.id}
              title={item?.title}
              description={item?.description}
              imageUrl={item?.thumbnail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
