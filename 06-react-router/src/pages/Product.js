import styles from "./Product.module.css";
import { useGetData } from "../hooks/useGetData";
import { useParams, NavLink } from "react-router-dom";
const Product = () => {
  const { id } = useParams();
  const url = "http://localhost:3000/products/" + id;
  const { data: product, loading, error } = useGetData(url);
  return (
    <>
      <p className={styles.id}>ID do produto: {id}</p>
      {error && <p>Ocorreu um erro...</p>}
      {loading && <p>Carregando produto...</p>}
      {product && (
        <div>
          <h1>{product.name}</h1>
          <div className={styles.image}>
            <img src={product.image} alt={product.name} />
          </div>
          <p className={styles.price}>R${product.price}</p>
          <NavLink to={`/products/${product.id}/info`}>
            Mais informações
          </NavLink>
        </div>
      )}
    </>
  );
};
export default Product;
