export function showToast(message, status = 'success') {
  const errorStyle = {
    background: 'linear-gradient(to right, #8B0000, #FFCCCB)',
    borderRadius: '1rem',
  };
  const successStyle = {
    background: 'linear-gradient(to right, #6B21A8, #A855F7, #E9D5FF)',
    borderRadius: '1rem',
  };

  const infoStyle = {
    background: 'linear-gradient(to right, #1E3A8A, #3B82F6, #BFDBFE)', // deep blue → bright → light
    borderRadius: '1rem',
  };
  Toastify({
    text: message,
    duration: 3000,
    // destination: 'https://github.com/apvarun/toastify-js',
    // newWindow: true,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style:
      status === 'error'
        ? errorStyle
        : status === 'info'
        ? infoStyle
        : successStyle,
    // onClick: function () {}, // Callback after click
  }).showToast();
}
