
function CardIcon(props) {
    const { clase, color, typeIcon, text, amount } = props;
    const Icon = typeIcon;
    return (
        <div
            className={`flex items-center p-4 ${clase} rounded-lg shadow-xs dark:bg-gray-800`}
        >
            <div
                className={`p-3 mr-4 text-${color}-500 bg-${color}-100 rounded-full dark:text-${color}-100 dark:bg-${color}-500`}
            >
                <Icon />
            </div>
            <div>
                <p
                    className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                    {text}
                </p>
                <p
                    className="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                    {amount}
                </p>
            </div>
        </div>
    );
}

export default CardIcon;