import {ProductTable} from "./product-table"
import PageWrapper from "@/components/page-wrapper";
import { getProductlist } from "@/services/productServices";

interface PageProps{
  searchParams: {[key: string]: string | undefined};
}
const ProductPage = async ({ searchParams }: PageProps) => {
  const page = parseInt(searchParams.page || "1");
  const data = await getProductlist({ pageSize: 10, currentPage: page });

  return <PageWrapper>
  <ProductTable title="Product " data={data} />
</PageWrapper>;
};

export default ProductPage;