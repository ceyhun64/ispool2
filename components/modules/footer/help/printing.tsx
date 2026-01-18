import React from 'react';

const BaskiNakisHizmetleri = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 py-24 bg-white text-gray-800 leading-relaxed">
      {/* Ana Başlık */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4 uppercase tracking-wide">
          Baskı Nakış Hizmetleri
        </h1>
        <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
      </header>

      {/* Giriş Bölümü */}
      <section className="mb-12 space-y-4">
        <p>
          Günümüz dünyasında kurumsal kimliğimizi tanıtmanın tartışmasız ilk ve en önemli yolu firma logonuzdur. 
          Kurumsal kimliğinizi ön planda tutmak için vazgeçilmez bir reklam olan logo, bir ürünün, firmanın ya da 
          hizmetin isminin, harf ve resimsel öğeler kullanılarak sembolleştirilmesidir.
        </p>
        <p>
          Firmamız kurumsal logonuzu satın aldığınız ürünlerin üzerine baskı veya nakış olarak uygulayabilmektedir.
        </p>
        <p className="font-medium italic text-blue-800">
          Müşteri odaklı ve kaliteli hizmet anlayışımızla sektörümüzün logo uygulamalarında en iyi standartları 
          kullanan firması olmaktan gurur duyarak, bize güvendiğiniz için teşekkür ediyoruz.
        </p>
      </section>

      {/* Baskı Çeşitleri Başlığı */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-8 text-gray-700">
          Baskı Çeşitlerimiz
        </h2>

        {/* Transfer Baskı */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Transfer Baskı</h3>
          <p>
            Transfer baskıda grafik bir şablona gerilmiş ipeğin yüzeyine aynalanarak foto emisyonları yardımıyla aktarılır. 
            İkinci işlem grafiğin boya yardımıyla transfer kağıdına incecik aktarılmasıdır; daha sonra kurutulup pres 
            ısısı yardımıyla ürüne uygulanır. Kullanım amacı ince, detaylı veya renk sayısı fazla olan grafiklerde 
            kusursuz sonuç almaktır.
          </p>
        </div>

        {/* Serigrafi Baskı */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Serigrafi Baskı</h3>
          <p>
            Serigrafi baskıya ipek baskısı veya özgün baskı adı da verilmektedir. Serigafi baskıda grafik bir şablona 
            gerilmiş ipeğin yüzeyine foto emisyonları yardımıyla aktarılır. Daha sonra bu şablon üzerine boya dökülüp 
            grafik ragle lastiği basıncı ile baskı yapılacak malzemeye transfer edilir. Baskının uzun süre solmadan 
            dayanıklı kalması istenilen yerlerde serigrafi baskı tercih edilir.
          </p>
        </div>

        {/* Folyo Flex Baskı */}
        <div className="mb-10 p-5 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Folyo Flex Baskı</h3>
          <p className="mb-4">
            Folyo Flex baskı grafiğin mevcut bulunan folyolardan ploter makineleri yardımıyla kesim yapılarak daha sonra 
            uygun sıcaklıkta ayarlanmış pres ile ürüne uygulanmasıdır. Ploter makineleri elmas uç ile kesim yapabilen 
            makinelerdir. X, Y, Z düzleminde kesim yapabildiğinden her türlü şekli ve yazıyı kesebilmektedir.
          </p>
          <div className="mt-4">
            <h4 className="font-bold mb-2">Özellikleri:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
              <li>Hoş görüntü</li>
              <li>Sıkı dokunuş</li>
              <li>Darbelere ve sürtünmelere karşı dayanıklılık</li>
              <li>Pürüzsüz yüzeylerde kayganlık özelliği</li>
            </ul>
          </div>
        </div>

        {/* Dijital Baskı */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Dijital Baskı</h3>
          <p>
            Geleneksel ofset baskı tekniğinde kullanılan, film ve klasik anlamdaki kalıp gibi iki vazgeçilmez unsurun 
            ortadan kaldırılmasıyla, herhangi bir fotoğraf, diapozitif, negatif ve basılmış görüntünün, tarayıcılarla 
            yada doğrudan dijital kameralar yoluyla bilgisayara aktarılarak, üzerinde çalışılıp değişiklikler 
            yapılmasına; bilgisayarda metin, grafik, çizim v.b. birleştirilerek bir grafik dökümanın bir dijital baskı 
            makinası yardımıyla doğrudan baskı materyaline basılmasına olanak tanıyan bir baskı sistemidir. Çok renkli 
            veya fotoğraf niteliğindeki diyaznlar için kullanılır.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BaskiNakisHizmetleri;