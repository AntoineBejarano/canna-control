export const deleteProduct = async (productId: number) => {
  // In a real application, you would make an API call here to delete the product.
  // For this example, we'll just simulate a successful deletion.
  await new Promise((resolve) => setTimeout(resolve, 500))

  // You might also want to handle errors and update the UI accordingly.
  console.log(`Product with ID ${productId} deleted.`)
}
