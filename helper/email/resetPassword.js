const resetPasswordTemplate = (token) => {
  `

<body>
    <div style="display: flex; flex-direction: column; gap: 30px; width: 100%">
        <p>click the button below to reset your password</p>
        <div style="display: flex; justify-content: center">
        <a href="${token}">
            <button style="background: #F04F2F; color: #fff; border: none">
                Reset Password
            </button>
        <a/>
        </div>
    </div>
</body>
`;
};

module.exports = resetPasswordTemplate;
