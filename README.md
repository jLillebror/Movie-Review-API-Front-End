# Webbapplikation för att interagera med ett REST-API

Denna webbapplikation möjliggör interaktion med ett REST-API för att hantera filmer och recensioner.
## Hur man kör backend-applikationen

Backend API finns här [GitHub](https://github.com/jLillebror/MovieReview_API)

1. Klona backend-projektet till din lokala maskin.
2. Öppna appsettings.json-filen i din applikation och uppdatera ConnectionStrings med den nödvändiga informationen:

    ```json
    "ConnectionStrings": {
        "MovieReviewAPIContext": "Server=Server Name;Database=Database Name;Trusted_Connection=True;User ID=User Name;Password=Password;"
    }
    ```

    Notera att "Server Name", "Database Name", "User Name" och "Password" måste ersättas med den korrekta informationen för din lokala miljö.

3. Skapa databasen lokalt med hjälp av Microsoft SQL Server Management Studio eller liknande verktyg, med den angivna anslutningssträngen.

4. Kör applikationen lokalt genom att starta den.
## Hur man startar applikationen

1. Klona detta projekt till din lokala maskin.
2. Öppna `index.html`-filen i en webbläsare.

## Användning

### Skapa ett konto

1. Gå till registreringssidan genom att klicka på "Registrera" i navigeringsfältet.
2. Fyll i formuläret med din e-postadress och lösenord.
3. Klicka på "Skapa konto" för att registrera dig.

### Logga in

1. Gå till inloggningssidan genom att klicka på "Logga in" i navigeringsfältet.
2. Ange din e-postadress och lösenord i inloggningsformuläret.
3. Klicka på "Logga in" för att logga in på ditt konto.

### Hantera filmer

 **Lägg till en film:**
  1. Logga in på ditt konto.
  2. Klicka på "Lägg till film" i navigeringsfältet.
  3. Fyll i formuläret med information om den nya filmen.
  4. Klicka på "Skapa film" för att lägga till filmen i databasen.

 **Uppdatera en film:**
  1. Logga in på ditt konto.
  2. Klicka på "Redigera" bredvid den film du vill uppdatera.
  3. Uppdatera informationen i formuläret.
  4. Klicka på "Spara" för att uppdatera filmens information.

**Ta bort en film:**
  1. Logga in på ditt konto.
  2. Klicka på "Ta bort" bredvid den film du vill ta bort.
  3. Bekräfta borttagningen i den dialogruta som visas.

### Hantera recensioner

**Lägg till en recension:**
  1. Logga in på ditt konto.
  2. Navigera till sidan för den film du vill recensera.
  3. Fyll i formuläret med din recension och betyg.
  4. Klicka på "Skicka" för att lägga till recensionen.

 **Uppdatera en recension:**
  1. Logga in på ditt konto.
  2. Navigera till sidan för den film där recensionen finns.
  3. Klicka på "Redigera" bredvid den recension du vill uppdatera.
  4. Uppdatera recensionen i formuläret.
  5. Klicka på "Spara" för att uppdatera recensionen.

 **Ta bort en recension:**
  1. Logga in på ditt konto.
  2. Navigera till sidan för den film där recensionen finns.
  3. Klicka på "Ta bort" bredvid den recension du vill ta bort.
  4. Bekräfta borttagningen i den dialogruta som visas.
