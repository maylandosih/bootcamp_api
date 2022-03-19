const { db, dbQuery } = require("../config/database")
const { uploader } = require("../config/multer");
const fs = require('fs');

module.exports = {
    getProducts: async (req, res) => {
        // 1. Ambil data dari table products
        // 2. Ambil data dari product_image
        // 3. looping results dari table products dan product image untuk digabungkan berdasarkan foreign key
        // CARA BEST PRACTICE MENGGUNAKAN PROMISIFY
        try {
            console.log(req.query.produk_id)
            let sqlGetProducts = `Select * from products ${req.query.produk_id ? `WHERE produk_id=${req.query.produk_id}` : ""};`;
            let sqlGetProductImage = `Select * from product_image;`;

            let getProducts = await dbQuery(sqlGetProducts);
            let getProductImage = await dbQuery(sqlGetProductImage);

            let newData = getProducts.map((value, index) => {
                value.images = [];
                getProductImage.forEach((val, idx) => {
                    if (value.produk_id == val.produk_id) {
                        value.images.push(val)
                    }
                });

                return value;
            })
            res.status(200).send(newData)

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addProduct: async (req, res) => {
        try {
            // console.log(req.body)
            // cara untuk upload 1 file
            const upload = uploader('/images', 'IMG').fields([{ name: 'images' }]);
            upload(req, res, async (error) => {
                try {
                    // Pengecekan
                    console.log(req.body.data);
                    console.log(req.files.images);
                    // Program sql
                    let { kategori_id, nama_produk, deskripsi_produk, harga_modal, harga_jual, jumlah_stok, gudang_id, images } = JSON.parse(req.body.data);
                    const filePath = req.files.images ? `/images/${req.files.images[0].filename}` : null;

                    let sqlProduct = `INSERT INTO products values (null, '${kategori_id}', '${nama_produk}', '${deskripsi_produk}', ${harga_modal}, ${harga_jual}, ${jumlah_stok}, '${gudang_id}', 'ready');`
                    console.log("sqlScript products", sqlProduct);
                    console.log("sqlScript product_images", `INSERT INTO product_image values (null, , '${filePath}')`)

                    let insertProduct = await dbQuery(sqlProduct);
                    console.log(insertProduct.insertId)
                    if (insertProduct.insertId) {
                        // for (let i = 0; i < req.files.length; i++) {
                        // }
                        let sqlProductImg = `INSERT INTO product_image values (null, ${insertProduct.insertId}, 'http://localhost:2025${filePath}')`
                        await dbQuery(sqlProductImg);

                        res.status(200).send({ message: "Add product success ✅" })
                    }
                } catch (error) {
                    fs.unlinkSync(`./public/images/${req.files.images[0].filename}`)
                    console.log(error);
                    res.status(500).send(error);
                }
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    deleteProduct: async (req, res) => {
        try {
            // console.log(req.params)
            let sqlProduct = `DELETE from products WHERE produk_id=${req.params.produk_id};`

            let getProductImage = `SELECT produk_id_image from product_image where produk_id=${req.params.produk_id};`

            await dbQuery(sqlProduct)

            getProductImage = await dbQuery(getProductImage);

            console.log(getProductImage)
            if (getProductImage.length > 0) {
                for (let i = 0; i < getProductImage.length; i++) {
                    await dbQuery(`DELETE from product_image WHERE produk_id_image=${getProductImage[i].produk_id_image};`)
                }
            }


            res.status(200).send({ message: "Delete product success ✅" })

        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }
    },
    updateProduct: async (req, res) => {
        try {
            console.log(req.body)
            let { produk_id, kategori_id, nama_produk, deskripsi_produk, harga_modal, harga_jual, jumlah_stok, gudang_id, images } = req.body
            // 1. memperbarui data table products utama
            let resUpdate = await dbQuery(`UPDATE products set kategori_id=${db.escape(kategori_id)}, nama_produk=${db.escape(nama_produk)},
                deskripsi_produk=${db.escape(deskripsi_produk)},harga_modal=${db.escape(harga_modal)},harga_jual=${db.escape(harga_jual)}, jumlah_stok=${db.escape(jumlah_stok)}, gudang_id=${db.escape(gudang_id)} 
                WHERE produk_id=${db.escape(produk_id)};`);

            // 2. memperbarui data table product_image
            images.forEach(async (value, index) => {
                await dbQuery(`UPDATE product_image set url=${db.escape(value.url)} 
                    WHERE produk_id_image=${value.produk_id_image}`)
            })

            res.status(200).send({ message: "Update product success✅", success: true })

        } catch (error) {
            console.log(error)
        }
    }
}