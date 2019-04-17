const Teams = new Map() 

Teams.set( 1879,{ 
    "venue": "Somewhere in Bonia", 
    "logoUrl": "https://www.google.com/search?q=Drita+KF+Gjilan&rlz=1C1AVFC_enDE810DE810&tbm=isch&source=iu&ictx=1&fir=CKYNqpaoVAPGpM%253A%252CksrDhWw7pcKZtM%252C%252Fm%252F02rt2r2&vet=1&usg=AI4_-kTE0rIu6B2Vr0PQisZEc9jJj45sdQ&sa=X&ved=2ahUKEwj1hubc2NfhAhWM3KQKHffUB7sQ_B0wC3oECBAQBg#imgrc=CKYNqpaoVAPGpM:" 
} );

Teams.set( 1902,{
    "venue": "Estadi Comunal d'Andorra la Vella, Camp d’Esports d’Aixovall",
    "logoUrl": "https://www.google.com/search?q=fc+santa+coloma&rlz=1C1AVFC_enDE810DE810&tbm=isch&source=iu&ictx=1&fir=QptGZkCA4LilxM%253A%252CQQTzIrFKXt5csM%252C%252Fm%252F03fmzl&vet=1&usg=AI4_-kS4nOhRUxBN9Me35KJh-jVHznnsbw&sa=X&ved=2ahUKEwip_I3T29fhAhVO6KQKHab2ArsQ_B0wC3oECBAQBg#imgrc=QptGZkCA4LilxM:" 
} );
    

Teams.set( 7281,{
    "venue": "Victoria Stadium",
    "logoUrl": "https://www.google.com/search?q=Lincoln+Red+Imps+FC&rlz=1C1AVFC_enDE810DE810&tbm=isch&source=iu&ictx=1&fir=X0YfcaTl6hcPxM%253A%252Cyii8ppPuG8L_oM%252C%252Fm%252F03nx88f&vet=1&usg=AI4_-kTPsFV-tKuwMxIpG70fNIMdqNTA7A&sa=X&ved=2ahUKEwjm0f2W39fhAhVEbVAKHd3HDQwQ_B0wDHoECA8QEQ#imgrc=X0YfcaTl6hcPxM:"
} );

Teams.set( 1891, {
    "venue": " \"Sheriff\" Sports Complex",
    "logoUrl": "https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjnofCn4NfhAhWSIlAKHeQnBPkQjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFC_Sheriff_Tiraspol&psig=AOvVaw1XgagcOY3KM9r49YR_Bqlr&ust=1555611966654283"
} );

Teams.set( 5100, {
    "venue": " Turner Stadium", 
    "logoUrl": "https://www.google.com/search?q=hapoel+be%27er+sheva+fc&rlz=1C1AVFC_enDE810DE810&tbm=isch&source=iu&ictx=1&fir=xOko06QRQhkLMM%253A%252CHxrsj_JZ5zLn_M%252C%252Fm%252F0f83g2&vet=1&usg=AI4_-kRuQXib-ZxJt2imW49n_1baWxv1Pg&sa=X&ved=2ahUKEwjXwsSM4dfhAhWFDuwKHZm-DN0Q_B0wC3oECBAQEQ#imgrc=xOko06QRQhkLMM:"
} );

Teams.set(1870,{
    "venue": " Stade Jos Nosbaum", 
    "logoUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fen%2Fthumb%2F1%2F11%2FF91_Dudelange.png%2F150px-F91_Dudelange.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FF91_Dudelange&docid=g1wHbA8hXPTW5M&tbnid=TsS6F7RhGQZYtM%3A&vet=10ahUKEwihs8P_4tfhAhWkyoUKHaNzCFQQMwg_KAAwAA..i&w=150&h=229&itg=1&bih=1367&biw=2560&q=F91%20Diddeleng&ved=0ahUKEwihs8P_4tfhAhWkyoUKHaNzCFQQMwg_KAAwAA&iact=mrc&uact=8"
} );

function getLogoURL(key) {
    return Teams.get(key).logoUrl;
}