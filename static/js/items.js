$(document).ready(function () {
    const token = sessionStorage.getItem("token")

    //Validasi Token & Role Badge
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;
        const $badge = $("#roleBadge");

        if (userRole === "staff") {
            // Jika Staff mencoba akses Manage Items, tendang balik ke Dashboard
            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: 'Hanya Admin yang boleh mengelola database barang!',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                window.location.href = "dashboard.html";
            });
            return;
        } else {
            // Kembalikan Role Badge (Admin Access - Merah)
            $badge.text("Admin Access").addClass("bg-danger").show();
        }
    } catch (e) {
        window.location.href = "index.html";
    }

    //Load Data Items
    function loadItems() {
        $.ajax({
            url: "/api/items",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
            success: function (res) {
                const $tableBody = $("#itemTable");
                $tableBody.empty();
                const data = Array.isArray(res) ? res : (res.data || []);

                data.forEach(i => {
                    const id = i.id || i.ID;
                    const name = i.name || i.Name;
                    const stock = i.stock ?? 0;
                    const price = i.price ?? 0;

                    $tableBody.append(`
                        <tr>
                            <td>${id}</td>
                            <td><strong>${name}</strong></td>
                            <td><span class="badge ${stock < 5 ? 'bg-warning text-dark' : 'bg-info'}">${stock}</span></td>
                            <td>Rp ${price.toLocaleString()}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" 
                                    onclick="openEditModal(${id}, '${name}', ${price}, ${stock})">Update</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteItem(${id})">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            }
        });
    }

    //Tambah Item Baru
    $("#btnAddItem").off("click").on("click", function () {
        const payload = {
            name: $("#name").val().trim(),
            stock: parseInt($("#stock").val()),
            price: parseFloat($("#price").val())
        };

        if (!payload.name || isNaN(payload.stock) || isNaN(payload.price)) {
            return Swal.fire("Input Tidak Valid", "Harap isi semua field dengan benar!", "warning");
        }

        $.ajax({
            url: "/api/items",
            method: "POST",
            headers: { 
                Authorization: "Bearer " + token,
                "Content-Type": "application/json" 
            },
            data: JSON.stringify(payload),
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Item baru telah didaftarkan',
                    timer: 1500,
                    showConfirmButton: false
                });
                $("#name, #stock, #price").val("");
                loadItems();
            },
            error: function (err) {
                Swal.fire("Gagal", err.responseJSON?.error || "Cek koneksi server", "error");
            }
        });
    });

    //Update Item (Modal)
    window.openEditModal = function(id, name, price, stock) {
        $("#editId").val(id);
        $("#editName").val(name);
        $("#editPrice").val(price);
        $("#editStock").val(stock);
        $("#editModal").modal("show");
    };

    $("#btnSaveUpdate").on("click", function() {
        const id = $("#editId").val();
        const payload = {
            name: $("#editName").val().trim(),
            price: parseFloat($("#editPrice").val()),
            stock: parseInt($("#editStock").val())
        };

        $.ajax({
            url: `/api/items/${id}`,
            method: "PUT",
            headers: { 
                Authorization: "Bearer " + token,
                "Content-Type": "application/json" 
            },
            data: JSON.stringify(payload),
            success: function() {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Data barang berhasil diperbarui!',
                    timer: 1500,
                    showConfirmButton: false
                });
                $("#editModal").modal("hide");
                loadItems();
            },
            error: function(err) {
                Swal.fire("Error", err.responseJSON?.error || "Gagal update data", "error");
            }
        });
    });

    //Delete Item
    window.deleteItem = function (id) {
        Swal.fire({
            title: 'Hapus Barang?',
            text: "Data ini akan hilang dari sistem inventaris!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/api/items/" + id,
                    method: "DELETE",
                    headers: { Authorization: "Bearer " + token },
                    success: function () {
                        Swal.fire('Terhapus!', 'Barang telah dihapus.', 'success');
                        loadItems();
                    }
                });
            }
        });
    };

    //Logout
    $("#btnLogout").click(function () {
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
    });

    loadItems();
});