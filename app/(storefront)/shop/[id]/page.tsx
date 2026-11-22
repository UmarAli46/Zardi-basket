import React from 'react';
import { notFound } from 'next/navigation';
import { Container, Box } from '@mui/material';
import { getProductById, getProducts } from '@/lib/db';
import ProductDetailClient from '@/components/storefront/ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts({ onlyActive: true });
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <Box sx={{ py: 6, backgroundColor: '#FAF7F2' }}>
      <Container maxWidth="lg">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </Container>
    </Box>
  );
}
