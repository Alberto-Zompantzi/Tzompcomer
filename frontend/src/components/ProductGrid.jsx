import ProductCard from './ProductCard';
import GroupedProductCard from './GroupedProductCard';
import { shouldGroupProducts, groupProductsIntoFamilies } from '../utils/productGrouping';

const ProductGrid = ({ products }) => {
  const shouldGroup = shouldGroupProducts(products);

  if (shouldGroup) {
    const groupedFamilies = groupProductsIntoFamilies(products);
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {groupedFamilies.map((familyGroup) => (
          <GroupedProductCard key={familyGroup.id} familyGroup={familyGroup} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
