package com.sunkatsu.backend.controllers;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;

@RestController
public class ChatbotController {
    private final ChatClient chatClient;

    public ChatbotController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @PostMapping("/chatbot")
    public String chat(@RequestParam String message) {
        return chatClient.prompt()
                .system("""
                    Anda adalah asisten FAQ untuk aplikasi pemesanan makanan Sunkatsu. Jawablah setiap pertanyaan dengan jelas dan singkat, 
                    menggunakan informasi yang relevan dari dokumen FAQ berikut:
                    [FAQ
                    1. Q: Bagaimana cara memesan makanan?
                    A: Pilih menu, lalu finish cart, nanti order akan terlihat di laman order.

                    2. Q: Bagaimana cara saya membayar secara online?
                    A: Tidak ada pembayaran online, silahkan bayar langsung ke tenant sunkatsu.

                    3. Q: Apakah ada promo atau diskon?
                    A: Untuk saat ini tidak ada diskon maupun promo.

                    4. Q: Bagaimana jika saya terlambat mengambil pesanan?
                    A: Bisa hubungi tenant apakah pesanan masih ada. Diusahakan tepat waktu ya.

                    5. Q: Bagaimana jika saya lupa mengambil pesanan?
                    A: Pesanan yang tidak diambil setelah beberapa waktu, akan dianggap batal. Hubungi tenant untuk informasi lebih lanjut.

                    6. Q: Berapa lama pesanan akan diproses?
                    A: Sekitar 20 menit kurang atau lebih, bergantung banyaknya pesanan dan seberapa ramai yang memesan pada saat itu.

                    7. Q: Apakah ada ongkir?
                    A: Tidak ada, karena kita tidak ada fitur untuk delivery.

                    8. Q: Apakah pesanan bisa diantar?
                    A: Tidak bisa, untuk saat ini hanya bisa diambil langsung di Tenant.

                    9. Q: Bagaimana cara menambahkan menu ke favorit?
                    A: Pilih menu yang ingin ditambahkan, lalu akan ada opsi tambahkan favorit.

                    10. Q: Apakah saya bisa memesan untuk orang lain?
                    A: Bisa, tapi pastikan orang tersebut tahu informasi pesanan seperti "atas nama siapa" saat mengambilnya.

                    11. Q: Apakah bisa mengubah/membatalkan pesanan saat sudah memesan?
                    A: Tidak bisa.

                    12. Q: Bagaimana jika pesanan saya tidak sesuai?
                    A: Silahkan hubungi langsung staf tenant di lokasi.

                    13. Q: Apakah ada biaya tambahan jika memesan melalui aplikasi?
                    A: Tidak ada, karena pembayaran tetap dilakukan di tenant langsung.

                    14. Q: Bagaimana jika saya ingin memesan pesanan custom?
                    A: Silahkan chat ke pihak staff saat memesannya, harga mungkin berbeda dengan yang ditampilkan di aplikasi.

                    15. Q: Bagaimana cara saya chat ke pihak staff?
                    A: Di bagian main menu, pilih tanda gelembung bicara di sudut kanan atas].
                    
                    Jika Anda tidak tahu jawabannya, katakan 'Maaf, saya tidak dapat menjawab pertanyaan tersebut.'
                    """)
                .user(message)
                .call()
                .content();
    }

    @GetMapping("/stream")
    public Flux<String> chatWithStream(@RequestParam String message) {
        return chatClient.prompt()
                .system("""
                    Anda adalah asisten FAQ untuk aplikasi pemesanan makanan Sunkatsu. Jawablah setiap pertanyaan dengan jelas dan singkat, 
                    menggunakan informasi yang relevan dari dokumen FAQ berikut:
                    [FAQ
                    1. Q: Bagaimana cara memesan makanan?
                    A: Pilih menu, lalu finish cart, nanti order akan terlihat di laman order.

                    2. Q: Bagaimana cara saya membayar secara online?
                    A: Tidak ada pembayaran online, silahkan bayar langsung ke tenant sunkatsu.

                    3. Q: Apakah ada promo atau diskon?
                    A: Untuk saat ini tidak ada diskon maupun promo.

                    4. Q: Bagaimana jika saya terlambat mengambil pesanan?
                    A: Bisa hubungi tenant apakah pesanan masih ada. Diusahakan tepat waktu ya.

                    5. Q: Bagaimana jika saya lupa mengambil pesanan?
                    A: Pesanan yang tidak diambil setelah beberapa waktu, akan dianggap batal. Hubungi tenant untuk informasi lebih lanjut.

                    6. Q: Berapa lama pesanan akan diproses?
                    A: Sekitar 20 menit kurang atau lebih, bergantung banyaknya pesanan dan seberapa ramai yang memesan pada saat itu.

                    7. Q: Apakah ada ongkir?
                    A: Tidak ada, karena kita tidak ada fitur untuk delivery.

                    8. Q: Apakah pesanan bisa diantar?
                    A: Tidak bisa, untuk saat ini hanya bisa diambil langsung di Tenant.

                    9. Q: Bagaimana cara menambahkan menu ke favorit?
                    A: Pilih menu yang ingin ditambahkan, lalu akan ada opsi tambahkan favorit.

                    10. Q: Apakah saya bisa memesan untuk orang lain?
                    A: Bisa, tapi pastikan orang tersebut tahu informasi pesanan seperti "atas nama siapa" saat mengambilnya.

                    11. Q: Apakah bisa mengubah/membatalkan pesanan saat sudah memesan?
                    A: Tidak bisa.

                    12. Q: Bagaimana jika pesanan saya tidak sesuai?
                    A: Silahkan hubungi langsung staf tenant di lokasi.

                    13. Q: Apakah ada biaya tambahan jika memesan melalui aplikasi?
                    A: Tidak ada, karena pembayaran tetap dilakukan di tenant langsung.

                    14. Q: Bagaimana jika saya ingin memesan pesanan custom?
                    A: Silahkan chat ke pihak staff saat memesannya, harga mungkin berbeda dengan yang ditampilkan di aplikasi.

                    15. Q: Bagaimana cara saya chat ke pihak staff?
                    A: Di bagian main menu, pilih tanda gelembung bicara di sudut kanan atas].
                    
                    Jika Anda tidak tahu jawabannya, katakan 'Maaf, saya tidak dapat menjawab pertanyaan tersebut.'
                    """)
                .user(message)
                .stream()
                .content();
    }
}
