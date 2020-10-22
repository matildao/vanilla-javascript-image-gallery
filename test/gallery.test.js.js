describe("index.js", function() {
  const testGallery = [
    {
      id: "14832734379",
      owner: "37507631@N06",
      secret: "e63a0ccf86",
      server: "3871",
      farm: 4,
      title: "Lino"
    },
    {
      id: "14832734379",
      owner: "37507631@N06",
      secret: "e63a0ccf86",
      server: "3871",
      farm: 5,
      title: "Lino"
    },
    {
      id: "14832734379",
      owner: "37507631@N06",
      secret: "e63a0ccf86",
      server: "3871",
      farm: 5,
      title: "Lino"
    }
  ];

  beforeEach(function() {
    let htmlfixture = `<div class="title-header">
                    <h1>Image Gallery</h1>
                    <h3>Matilda Olsson</h3>
                    <div class="change-gallery-input">
                        <input id="gallery-input" type="text" placeholder="Gallery Id" />
                        <button onclick="changeGallery()">Change Gallery</button>
                    </div>
                </div>
                <div id="gallery-container" class="gallery-container"></div>`;

    document.body.insertAdjacentHTML("afterbegin", htmlfixture);
    jasmine.clock().install();
  });
  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it("should display images correctly to DOM", function() {
    const galleryTestContainer = document.getElementById("gallery-container");

    displayImages(testGallery, galleryTestContainer);
    jasmine.clock().tick(11);
    expect(
      document.getElementById("gallery-container").children.length
    ).toEqual(3);
  });

  it("should slice array according to limit input", function() {
    let result = showNextGalleryPart(testGallery, 0, 1);
    jasmine.clock().tick(11);
    expect(result.length).toEqual(1);
  });
});
