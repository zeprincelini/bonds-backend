const resetPasswordTemplate = (url, id) => {
  `
<body>
    <div style="display: flex; flex-direction: column; gap: 30px; width: 100%; padding: 10px;">
        <p>click the button below to reset your password</p>
        <div style="display: flex; justify-content: center">
        <a href="${url}/reset/${id}">
            <button style="background: #F04F2F; color: #fff; border: none; border-radius: 10px; padding: 10px; font-weight: bold;">
                Reset Password
            </button>
        <a/>
        </div>
    </div>
</body>
`;
};

module.exports = resetPasswordTemplate;
