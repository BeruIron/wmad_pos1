"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductModel } from "@/models/api/productModel";
import PaginationData from "@/models/PaginationData";
import { TableViewPagination } from "@/components/tableview-pagination";
import Link from "next/link";
interface Props {
  title: string;
  data: PaginationData<ProductModel>;
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // Cleanup the timeout
  }, [value, delay]);

  return debouncedValue;
}

export const ProductTable: React.FC<Props> = ({ title, data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchQueryDebounced = useDebounce(searchQuery, 300); // Debounce search query

  const [paginatedData, setPaginatedData] = useState<
    PaginationData<ProductModel>
  >({
    currentPage: 1,
    nextPage: 1,
    prevPage: 1,
    pageSize: 10,
    records: [],
    totalPages: 1,
    totalItems: 1,
  });

  const handlePrevClick = () =>
    setPaginatedData((prev) => {
      return { ...prev, currentPage: data.prevPage };
    });

  const handleNextClick = () =>
    setPaginatedData((prev) => {
      return { ...prev, currentPage: data.nextPage };
    });

  const handlePageClick = (i: number) =>
    setPaginatedData({ ...paginatedData, currentPage: i + 1 });
  useEffect(() => {
    fetch("/api/product?currentPage=1&pageSize=10", {
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => setPaginatedData(data.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const filteredRecords = paginatedData.records.filter(
    (item) =>
      item.nameEn.toLowerCase().includes(searchQueryDebounced.toLowerCase()) ||
      item.nameKh.toLowerCase().includes(searchQueryDebounced.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(searchQueryDebounced.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQueryDebounced.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Product List</h1>

      <div className="flex justify-between items-center">
        <Input
          className="max-w-sm"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <a href="/product/create">
          <Button>Add Product</Button>
        </a>
      </div>
      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>English Name</TableHead>
              <TableHead>Khmer Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sku</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-100">
                <TableCell>
                  <Link href={`/productInfo/${item.id}`} className="block">
                    {item.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/productInfo/${item.id}`} className="block">
                    {item.nameEn}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/productInfo/${item.id}`} className="block">
                    {item.nameKh}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/productInfo/${item.id}`} className="block">
                    {item.category}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/productInfo/${item.id}`} className="block">
                    {item.sku}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/productInfo/${item.id}`} className="block">
                    {item.imageUrl}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TableViewPagination
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
        onPageClick={(i) => handlePageClick(i)}
        path="/product"
        data={paginatedData}
      />
    </div>
  );
};
