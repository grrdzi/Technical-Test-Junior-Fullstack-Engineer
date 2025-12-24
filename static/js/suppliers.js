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
            // Jika Staff mencoba akses, beri peringatan dan lempar ke Dashboard
            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: 'Halaman ini khusus untuk Admin!',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                window.location.href = "dashboard.html";
            });
            return;
        } else {
            // Jika Admin, Munculkan Badge Merah di Navbar
            $badge.text("Admin Access").addClass("bg-danger").show();
        }
    } catch (e) {
        window.location.href = "index.html";
    }

    //Load Data Supplier
    function loadSuppliers() {
        $.ajax({
            url: "/api/suppliers",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
            success: function (res) {
                const $tableBody = $("#supplierTable");
                $tableBody.empty();
                const data = Array.isArray(res) ? res : (res.data || []);

                data.forEach(s => {
                    const id = s.id || s.ID;
                    const name = s.name || s.Name;
                    const email = s.email || s.Email || "-";
                    const address = s.address || s.Address || "-";

                    $tableBody.append(`
                        <tr>
                            <td>${id}</td>
                            <td><strong>${name}</strong></td>
                            <td>${email}</td>
                            <td>${address}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" 
                                    onclick="openEditModal(${id}, '${name}', '${email}', '${address}')">Update</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${id})">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            }
        });
    }

    //Tambah Supplier
    $("#btnAddSupplier").click(function () {
        const payload = {
            name: $("#name").val().trim(),
            email: $("#email").val().trim(),
            address: $("#address").val().trim()
        };

        if (!payload.name || !payload.email || !payload.address) {
            return Swal.fire("Input Kosong", "Semua kolom wajib diisi!", "warning");
        }

        $.ajax({
            url: "/api/suppliers",
            method: "POST",
            headers: { 
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Tersimpan',
                    text: 'Supplier berhasil ditambahkan',
                    timer: 1500,
                    showConfirmButton: false
                });
                $("#name, #email, #address").val("");
                loadSuppliers();
            },
            error: function(err) {
                Swal.fire("Gagal", err.responseJSON?.error || "Gagal menyimpan data", "error");
            }
        });
    });

    //Update Supplier
    window.openEditModal = function(id, name, email, address) {
        $("#editSupplierId").val(id);
        $("#editSupplierName").val(name);
        $("#editSupplierEmail").val(email);
        $("#editSupplierAddress").val(address);
        $("#editSupplierModal").modal("show");
    };

    $("#btnSaveUpdateSupplier").click(function() {
        const id = $("#editSupplierId").val();
        const payload = {
            name: $("#editSupplierName").val().trim(),
            email: $("#editSupplierEmail").val().trim(),
            address: $("#editSupplierAddress").val().trim()
        };

        $.ajax({
            url: `/api/suppliers/${id}`,
            method: "PUT",
            headers: { 
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            success: function() {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data supplier diperbarui',
                    timer: 1500,
                    showConfirmButton: false
                });
                $("#editSupplierModal").modal("hide");
                loadSuppliers();
            }
        });
    });

    //Delete Supplier
    window.deleteSupplier = function(id) {
        Swal.fire({
            title: 'Hapus Supplier?',
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/suppliers/${id}`,
                    method: "DELETE",
                    headers: { Authorization: "Bearer " + token },
                    success: function () {
                        Swal.fire('Terhapus!', 'Supplier telah dihapus.', 'success');
                        loadSuppliers();
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

    loadSuppliers();
});