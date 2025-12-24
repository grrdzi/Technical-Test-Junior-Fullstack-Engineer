$(document).ready(function () {
    const token = sessionStorage.getItem("token")
    let cart = []

    if (!token) {
        window.location.href = "index.html"
        return
    }

    const payload = JSON.parse(atob(token.split('.')[1]))
    const userRole = payload.role 

    if (userRole === "staff") {
        $(".admin-only").hide()
        $("#roleBadge").text("Staff Access").addClass("bg-secondary")
    } else {
        $("#roleBadge").text("Admin Access").addClass("bg-danger")
    }

    function loadSuppliers() {
        $.ajax({
            url: "/api/suppliers",
            method: "GET",
            headers: { "Authorization": "Bearer " + token },
            success: function (res) {
                $("#supplier").empty().append('<option value="">Pilih Supplier</option>')
                const data = Array.isArray(res) ? res : (res.data || [])
                data.forEach(s => $("#supplier").append(`<option value="${s.id}">${s.name}</option>`))
            }
        })
    }

    function loadItems() {
        $.ajax({
            url: "/api/items",
            method: "GET",
            headers: { "Authorization": "Bearer " + token },
            success: function (res) {
                $("#item").empty().append('<option value="">Pilih Item</option>')
                const data = Array.isArray(res) ? res : (res.data || [])
                data.forEach(i => {
                    const stock = i.stock ?? 0;
                    $("#item").append(`<option value="${i.id}">${i.name} (Stock: ${stock})</option>`)
                })
            }
        })
    }

    // --- TAMBAH KE KERANJANG DENGAN VALIDASI SUPPLIER ---
    $("#btnAdd").click(function () {
        const supplierId = $("#supplier").val()
        const itemId = $("#item").val()
        const fullText = $("#item option:selected").text()
        const qty = parseInt($("#qty").val())

        // VALIDASI 1: Cek Supplier dulu
        if (!supplierId) {
            return Swal.fire({
                icon: 'warning',
                title: 'Supplier Belum Pilih',
                text: 'Harap pilih supplier sebelum memasukkan barang ke keranjang.',
                confirmButtonColor: '#3085d6'
            })
        }

        // VALIDASI 2: Cek Item dan Qty
        if (!itemId) return Swal.fire("Peringatan", "Pilih item terlebih dahulu", "warning")
        if (!qty || qty <= 0) return Swal.fire("Peringatan", "Jumlah (Qty) tidak valid", "warning")

        const itemName = fullText.split(" (Stock:")[0]
        
        // Simpan ke array cart
        cart.push({ item_id: Number(itemId), qty: Number(qty), name: itemName })
        
        renderCart()
        $("#qty").val("1")
        
        // Lock dropdown supplier agar tidak berubah di tengah jalan
        $("#supplier").attr("disabled", true)

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: `${itemName} ditambahkan ke list`,
            timer: 1000,
            showConfirmButton: false
        })
    })

    function renderCart() {
        $("#cartTable").empty()
        cart.forEach((c, index) => {
            $("#cartTable").append(`
                <tr>
                    <td>${c.name}</td>
                    <td>${c.qty}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
                </tr>
            `)
        })

        // Jika cart kosong, buka kembali dropdown supplier
        if (cart.length === 0) {
            $("#supplier").attr("disabled", false)
        }
    }

    window.removeItem = function (index) {
        cart.splice(index, 1)
        renderCart()
    }

    // --- SUBMIT ---
    $("#btnSubmit").click(function () {
        const supplierId = $("#supplier").val()
        
        if (cart.length === 0) return Swal.fire("Gagal", "Keranjang belanja kosong", "error")

        const payload = {
            supplier_id: Number(supplierId),
            items: cart.map(c => ({ item_id: Number(c.item_id), qty: Number(c.qty) }))
        }

        $.ajax({
            url: "/api/purchase",
            method: "POST",
            headers: { 
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            success: function (res) {
                Swal.fire({
                    icon: 'success',
                    title: 'Purchase Berhasil!',
                    text: 'Data inventaris telah diperbarui.',
                })
                
                // Reset State
                cart = []
                renderCart()
                loadItems()
                $("#supplier").attr("disabled", false).val("") 
                $("#result").text("Last Transaction ID: " + (res.id || res.ID))
            },
            error: function (err) {
                Swal.fire("Error", err.responseJSON?.error || "Gagal memproses transaksi", "error")
            }
        })
    })

    $("#btnLogout").click(function () {
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
    });

    loadSuppliers()
    loadItems()
})