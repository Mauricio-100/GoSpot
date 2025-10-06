from setuptools import setup

setup(
    name='gospot',
    version='1.0.3',
    py_modules=['gospot'],
    entry_points={
        'console_scripts': [
            'gospot = gospot:run_gospot_js',
        ],
    },
    install_requires=[],
    python_requires='>=3.8',
    description='GoSpot CLI wrapper Python pour iSH et Linux',
    author='Mauricio',
    url='https://github.com/Mauricio-100/GoSpot',
)
