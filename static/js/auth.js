$(document).ready(function () {
    sessionStorage.clear();

    // Fungsi pembantu untuk notifikasi sukses
    function notifySuccess(title, text) {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            timer: 2000,
            showConfirmButton: false
        });
    }

    // Fungsi pembantu untuk notifikasi error
    function notifyError(text) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: text
        });
    }

    // --- REGISTRASI ---
    $("#btnRegister").click(function () {
        const role = $("#role").val();
        const username = $("#username").val();
        const password = $("#password").val();

        if (!role) return notifyError("Silakan pilih role terlebih dahulu!");
        if (!username || !password) return notifyError("Username dan Password tidak boleh kosong!");

        const userData = {
            username: username,
            password: password,
            role: role
        };

        $.ajax({
            url: "/api/auth/register",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(userData),  
            success: function (res) {
                notifySuccess("Registrasi Berhasil!", "Silakan login dengan akun Anda.");
                $("#username, #password").val("");
                $("#role").val("");
            },
            error: function (err) {
                const errorMsg = err.responseJSON?.message || err.responseJSON?.error || "Gagal melakukan registrasi";
                notifyError(errorMsg);
            }
        });
    });

    // --- LOGIN ---
    $("#btnLogin").click(function () {
        const role = $("#role").val();
        const username = $("#username").val();
        const password = $("#password").val();

        if (!role) return notifyError("Pilih role Anda terlebih dahulu!");
        if (!username || !password) return notifyError("Username dan Password wajib diisi!");

        const loginData = {
            username: username,
            password: password,
            role: role
        };

        $.ajax({
            url: "/api/auth/login",
            method: "POST",
            contentType: "application/json", 
            data: JSON.stringify(loginData), 
            success: function (res) {
                // VALIDASI: Pastikan server mengirimkan token
                if (res.token) {
                    // SIMPAN KE sessionStorage (Hapus tab = Logout otomatis)
                    sessionStorage.setItem("token", res.token);
                    
                    // Alert sukses sebelum pindah halaman
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Berhasil!',
                        text: 'Mengalihkan ke dashboard...',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "dashboard.html";
                    });
                } else {
                    notifyError("Server tidak memberikan token akses.");
                }
            },
            error: function (err) {
                const errorMsg = err.responseJSON?.message || err.responseJSON?.error || "Username atau Password salah";
                notifyError(errorMsg);
            }
        });
    });
});