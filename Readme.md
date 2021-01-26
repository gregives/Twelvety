Doce
Ver el sitio de demostración

Twelvety es un proyecto inicial preconfigurado de Eleventy construido para ser rápido. Incluye:

Arquitectura de componentes
Canalización de CSS usando Sass, PostCSS y CleanCSS
Canalización JS usando Browserify, Babel y Uglify
CSS y JS específicos de la página
CSS crítico en línea y diferir CSS no crítico
HTML, CSS y JS minimizados
Código corto de imagen sensible con soporte AVIF y WebP
Contenido-hash de activos
Escriba componentes como este:

< main  class = " home " > 
  < h1  class = " home__title " > Docety </ h1 > 
</ main >

{% hoja de estilo 'scss'%}
  @importar 'mixins';

  .casa {
    @incluir contenedor;

    & __ title {
      color rojo;
    }
  }
{% endstylesheet%}

{% javascript%}
  console.log ('Súper rápido 💨')
{% endjavascript%}
Implementar para netlify
Para implementar rápidamente su propia instancia de Twelvety para netlify, simplemente haga clic en el botón de abajo y siga las instrucciones.

Implementar para netlify

¿Qué pasará cuando haga clic en este botón? Netlify clonará el repositorio de git de Twelvety en su cuenta de GitHub (le pedirá permiso para hacer esto), agregará el nuevo repositorio a su cuenta de netlify y lo implementará.

Ejecutar localmente
Haga clic en el Use this templatebotón en la parte superior de este repositorio para crear su propio repositorio Twelvety en su cuenta de GitHub. Clona o descarga tu nuevo repositorio Twelvety en tu computadora.

Necesitará Node.js y npm (incluidos con Node.js). Para instalar los paquetes necesarios, ejecute

npm install
Comandos
Ejecutar npm run servepara ejecutar un servidor de desarrollo y recargar en vivo
Ejecutar npm run buildpara construir para producción
Ejecutar npm run cleanpara limpiar la carpeta de salida y el caché Twelvety
Los cerebros de Twelvety viven en la utilscarpeta: si solo quieres crear un sitio web, no necesitas tocar nada dentro utils. Sin embargo, si desea cambiar alguno de los códigos cortos, ¡eche un vistazo!

Caracteristicas
Twelvety configura transformaciones, códigos cortos y algunas opciones sensatas de Eleventy. Haga clic en las funciones siguientes para saber cómo funcionan.

stylesheet shortcode emparejado
styles Código corto
javascript shortcode emparejado
script Código corto
asset Código corto
picture Código corto
append shortcode emparejado y transformar
markdown shortcode y configuración emparejados
critical transformar
format transformar
Código de Visual Studio
Si está utilizando Visual Studio Code, recomiendo esta extensión Liquid para que su Sass y JavaScript se resalten correctamente.

Lanzamientos 5
v1.2.2
Último
