const { db, dbQuery } = require("../config/database")

module.exports = {
    getCart: async (req, res) => {
        try {
            let selectCart = `SELECT cart.*, products.nama_produk, products.harga_jual, product_image.url as url_image from cart
            JOIN products on cart.produk_id = products.produk_id
            JOIN product_image on cart.produk_id = product_image.produk_id
            GROUP BY cart.produk_id;`

            selectCart = await dbQuery(selectCart)

            res.status(200).send(selectCart)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addCart: async (req, res) => {
        try {
            let addCart = `INSERT INTO cart values (null, ${db.escape(req.body.user_id)}, 
            ${db.escape(req.body.produk_id)}, ${db.escape(req.body.qty)});`

            addCart = await dbQuery(addCart)

            if (addCart.insertId) {
                res.status(200).send({ message: "Add to cart success ✅", success: true })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    removeCart: async (req, res) => {
        try {
            let removeCart = `DELETE FROM cart WHERE cart_id=${db.escape(req.params.cart_id)}`
            await dbQuery(removeCart)

            res.status(200).send(removeCart)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },

    getReportSales: async (req, res) => {
        try {
            let scriptQuery = `select DATE_FORMAT(t.transaction_date,"%e %M %Y") AS 'Date,
           td.nama_produk,
           td.qty,
           t.harga_jual,
           from transaction_details td
           join transactions t
           on t.transaction_id=td.transaction_id
           where t.payment_status = "paid" && t.transaction_type = "normal"
           order by t.transaction_id`

            await dbQuery(scriptQuery);

            res.status(200).send(res)

        } catch (error) {
            console.log(error)
            res.status(500).send(err)
        }

    },

    getRevenue: async (req, res) => {
        try {
            let scriptQuery = `select
            sum(t.harga_jual) AS "Revenue"
            from transaction_details td
            join transactions t on t.transaction_id = td.transaction_id
            where t.payment_status = "paid"
            order by t.transaction_id;`

            await dbQuery(scriptQuery);

            res.status(200).send(res)

        } catch (error) {
            console.log(error)
            res.status(500).send(err)
        }
    }
}