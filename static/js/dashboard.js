$(document).ready(function () {
    const token = sessionStorage.getItem("token");

    // AUTHENTICATION & ROLE CHECK
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;
        const $badge = $("#roleBadge");

        if (userRole === "staff") {
            $(".admin-only").hide();
            $badge.text("Staff Access").addClass("bg-secondary").show();
        } else {
            $(".admin-only").show();
            $badge.text("Admin Access").addClass("bg-danger").show();
        }
    } catch (e) {
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
    }

    // LOAD DATA ITEMS (VIEW ONLY)
    function loadItems() {
        $.ajax({
            url: "/api/items",
            method: "GET",
            headers: { "Authorization": "Bearer " + token },
            success: function (res) {
                const $tableBody = $("#itemTable");
                $tableBody.empty();
                
                const data = Array.isArray(res) ? res : (res.data || []);

                if (data.length === 0) {
                    $tableBody.append('<tr><td colspan="4" class="text-center text-muted">No items found</td></tr>');
                    return;
                }

                data.forEach(item => {
                    const id = item.id || item.ID;
                    const name = item.name || item.Name;
                    const stock = item.stock ?? 0;
                    const price = item.price ?? 0;

                    // Badge warna stok: Kuning jika menipis (<5), Biru jika aman
                    const stockBadge = stock < 5 ? 'bg-warning text-dark' : 'bg-info text-white';

                    $tableBody.append(`
                        <tr>
                            <td>${id}</td>
                            <td><strong>${name}</strong></td>
                            <td><span class="badge ${stockBadge}">${stock}</span></td>
                            <td>Rp ${price.toLocaleString()}</td>
                        </tr>
                    `);
                });
            },
            error: function (err) {
                if (err.status === 401) {
                    Swal.fire("Session Expired", "Silakan login kembali", "warning").then(() => {
                        sessionStorage.removeItem("token");
                        window.location.href = "index.html";
                    });
                } else {
                    Swal.fire("Error", "Gagal memuat data inventaris", "error");
                }
            }
        });
    }

    // LOGOUT
    $("#btnLogout").click(function () {
        Swal.fire({
            title: 'Logout dari sistem?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Logout',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("token");
                window.location.href = "index.html";
            }
        });
    });

    loadItems();
});