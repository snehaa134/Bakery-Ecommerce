const formatPrice = (price) => {
   return Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
   }).format(Number(price))
}

export default formatPrice;