import { LeftArrowIcon, StarIcon } from "@/ui/icons";
import { getCookie } from "@/utils/serverAction";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const getProductInfo = async (id: string) => {
  const cookie = await getCookie("auth_token");

  const res = await fetch(`https://dummyjson.com/auth/products/${id}`, {
    next: { revalidate: 0 },
    headers: {
      Authorization: `Bearer ${cookie?.value}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 200) {
    return res.json();
  } else if (res.status === 401 || res.status === 403) {
    return "no_auth";
  } else {
    return null;
  }
};

const ProductNotFound = () => {
  return (
    <div className="flex justify-center items-center">
      <p className="text-2xl text-center">Product with given ID not found</p>
    </div>
  );
};

export default async function SingleProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductInfo(params.id);

  if (!product) {
    return <ProductNotFound />;
  }
  // not authenticated
  else if (product === "no_auth") {
    redirect("/");
  }

  return (
    <div className="my-20 flex justify-center items-center ">
      <div className="max-w-sm flex flex-col gap-8 ">
        <div className="flex items-center gap-2">
          <Link href="/products" passHref>
            <LeftArrowIcon className="h-5 w-5 cursor-pointer" />
          </Link>

          <h1 className="text-3xl font-semibold"> Product Information</h1>
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative h-60 w-96">
            <Image
              src={product?.thumbnail}
              fill
              alt={`product_thumbnail_${product?.id}`}
              className="rounded-t-md w-full h-full"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-medium">{product?.title}</p>
            <div className="flex items-center gap-1">
              <StarIcon className="text-yellow-500" />
              <span className="font-medium"> {product?.rating} </span>
            </div>
          </div>
          <p className="text-base font-light">{product?.description}</p>
          <p>
            <span className="font-medium">Price: </span> ${product?.price}
          </p>
          <p className="text-sm ">discount: {product?.discountPercentage}%</p>
          <p className="font-medium text-sm">Brand: {product?.brand}</p>
          <p className="text-sm">Category: {product?.category}</p>

          <div className="grid grid-cols-3 gap-2">
            {product?.images?.map((item: any, index: number) => (
              <div key={index} className="relative">
                <Image src={item} alt="item_${index}" width={50} height={50} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
