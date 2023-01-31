$(function () {

  let width = $(window).width();

  if (width < 1000) {
    $(".bottom-nav-wrapper").stop().animate({ 'bottom': '0px' }, 500);
    $(".bottom-nav-sub-wrapper").stop().animate({ 'bottom': '50px' }, 500);
    $(".main-wrapper").stop().animate({ 'padding-right': '0' }, 500);
    $(".side-wrapper").stop().animate({ 'right': '-300px' }, 500);
    $(".other-reviews").stop().css({ 'margin-bottom': '100px' });
  } else {
    $(".bottom-nav-wrapper").stop().animate({ 'bottom': '-80px' }, 500);
    $(".bottom-nav-sub-wrapper").stop().animate({ 'bottom': '-80px' }, 500);
    $(".main-wrapper").stop().animate({ 'padding-right': '200px' }, 500);
    $(".side-wrapper").stop().animate({ 'right': '0' }, 300);
    $(".other-reviews").stop().css({ 'margin-bottom': '0' });
  }

  $(window).resize(function () {
    width = $(this).width();
    if (width < 1000) {
      $(".bottom-nav-wrapper").stop().animate({ 'bottom': '0px' }, 500);
      $(".bottom-nav-sub-wrapper").stop().animate({ 'bottom': '50px' }, 500);
      $(".main-wrapper").stop().animate({ 'padding-right': '0' }, 500);
      $(".side-wrapper").stop().animate({ 'right': '-300px' }, 500);
      $(".other-reviews").stop().css({ 'margin-bottom': '100px' });
    } else {
      $(".bottom-nav-wrapper").stop().animate({ 'bottom': '-80px' }, 500);
      $(".bottom-nav-sub-wrapper").stop().animate({ 'bottom': '-80px' }, 500);
      $(".main-wrapper").stop().animate({ 'padding-right': '200px' }, 500);
      $(".side-wrapper").stop().animate({ 'right': '0' }, 300);
      $(".other-reviews").stop().css({ 'margin-bottom': '0' });
    }
  });

  $(document).on("click", ".all-select .check", function () {
    $(".check").get().forEach(e => e.checked = $(this).prop("checked"));
  });

  $(document).on("click", ".row .check", function () {
    $(".all-select .check").prop("checked", $(".row .check").get().every(e => { return e.checked }));
  });

  $(document).on("click", ".option-box .del-btn", function () {
    removeCart(0);
  });

  $(document).on("click", ".row .del-btn", function () {
    removeCart(this);
  });

  minusCheck();

  $(document).on("click", ".minus-btn", function () {
    (async () => {
      const row = $(this).closest(".row");
      const bookId = row.find(".check").data("id");
      const success = await fetch("/cart/remove?bookId=" + bookId).then(res => res.text());
      if (success) {
        const count = row.find(".count");
        const countVal = Number(count.val())--;
        const originPrice = row.find(".origin-price");
        const originPriceVal = Number(originPrice.data("value")) * countVal;
        const discountPrice = row.find(".discount-price");
        const discountPriceVal = Number(discountPrice.data("value")) * countVal;
        originPrice.text(originPriceVal.toLocaleString('ko-KR') + '원');
        discountPrice.text(discountPriceVal.toLocaleString('ko-KR') + '원');
        count.val(countVal);
        sumUpdate();
        minusCheck();
      } else {
        alert("요청이 실패하였습니다.");
      }
    })();
  });

  $(document).on("click", ".plus-btn", function () {
    (async () => {
      const row = $(this).closest(".row");
      const bookId = row.find(".check").data("id");
      const result = await fetch("/cart/add?bookId=" + bookId).then(res => res.text());
      if (result == 'ok') {
        const count = row.find(".count");
        const countVal = Number(count.val())++;
        const originPrice = row.find(".origin-price");
        const originPriceVal = Number(originPrice.data("value")) * countVal;
        const discountPrice = row.find(".discount-price");
        const discountPriceVal = Number(discountPrice.data("value")) * countVal;
        originPrice.text(originPriceVal.toLocaleString('ko-KR') + '원');
        discountPrice.text(discountPriceVal.toLocaleString('ko-KR') + '원');
        count.val(countVal);
        sumUpdate();
        minusCheck();
      } else if (result == 'sold') {
        alert("재고가 부족합니다.");
      } else {
        alert("요청이 실패하였습니다.");
      }
    })();
  });

});

function removeCart(_this) {
  (async () => {
    const isOne = _this == 0 ? false : true;
    const data = isOne ? $(_this).parent().find("input").data("id")
      : $(".row input:checked").get().map(e => { return e.dataset.id });

    const success = await fetch("/cart/remove", {
      method: 'post',
      cache: "no-cache",
      body: new URLSearchParams({ bookIds: data })
    }).then(res => res.json());

    if (success) {
      isOne ? $(_this).parent().remove()
        : $(".row input:checked").get().forEach(e => e.parentNode.remove());
      $(".row").get().length == 0 ? location.reload() : sumUpdate();
    } else {
      alert("요청이 실패하였습니다.");
    }
  })();
}

function sumUpdate() {
  (async () => {
    const update = await fetch("/cart/sum").then(res => res.text());
    $("#sum").replaceWith(update);
  })();
}

function minusCheck() {
  $(".amount-box").get().forEach(e => {
    e.querySelector("input").value < 2 ? e.querySelector(".minus-btn").classList.add('disable')
      : e.querySelector(".minus-btn").classList.remove('disable');
  });
}




