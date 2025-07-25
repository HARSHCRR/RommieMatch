import 'package:flutter/material.dart';

void main() {
  runApp(const RoomieMatchApp());
}

class RoomieMatchApp extends StatelessWidget {
  const RoomieMatchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RoomieMatch',
      theme: ThemeData(
        primaryColor: const Color(0xFF1F5FF8),
        scaffoldBackgroundColor: Colors.white,
        colorScheme: ColorScheme.fromSwatch().copyWith(
          primary: const Color(0xFF1F5FF8),
          secondary: Colors.white,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1F5FF8),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        textTheme: const TextTheme(
          headlineMedium: TextStyle(
            color: Color(0xFF1F5FF8),
            fontWeight: FontWeight.bold,
          ),
          bodyMedium: TextStyle(
            color: Colors.black,
          ),
        ),
      ),
      home: const SplashScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const OnboardingScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1F5FF8),
      body: Center(
        child: Text(
          'RoomieMatch',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: Colors.white,
                fontSize: 36,
              ),
        ),
      ),
    );
  }
}

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(Icons.people, size: 120, color: const Color(0xFF1F5FF8)),
            const SizedBox(height: 32),
            Text(
              'Find your perfect roommate',
              style: Theme.of(context).textTheme.headlineMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            const Text(
              'RoomieMatch helps you discover compatible roommates and trusted properties. Swipe, match, and move in with confidence!',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1F5FF8),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                  );
                },
                child: const Text('Get Started', style: TextStyle(fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool isLoading = false;

  void login() async {
    setState(() {
      isLoading = true;
    });
    await Future.delayed(const Duration(seconds: 1));
    setState(() {
      isLoading = false;
    });
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const ProfileSetupScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Login'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF1F5FF8),
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1F5FF8),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: isLoading ? null : login,
                child: isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text('Login', style: TextStyle(fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController ageController = TextEditingController();
  String gender = 'Other';
  bool isClean = false;
  bool likesGuests = false;
  bool isSmoker = false;
  bool hasPets = false;
  bool isLoading = false;

  void submitProfile() async {
    setState(() {
      isLoading = true;
    });
    await Future.delayed(const Duration(seconds: 1));
    setState(() {
      isLoading = false;
    });
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Set Up Profile'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF1F5FF8),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: ageController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Age',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: gender,
              decoration: const InputDecoration(
                labelText: 'Gender',
                border: OutlineInputBorder(),
              ),
              items: const [
                DropdownMenuItem(value: 'Male', child: Text('Male')),
                DropdownMenuItem(value: 'Female', child: Text('Female')),
                DropdownMenuItem(value: 'Other', child: Text('Other')),
              ],
              onChanged: (val) {
                setState(() {
                  gender = val ?? 'Other';
                });
              },
            ),
            const SizedBox(height: 24),
            const Text('Lifestyle Preferences', style: TextStyle(fontWeight: FontWeight.bold)),
            CheckboxListTile(
              value: isClean,
              onChanged: (val) => setState(() => isClean = val ?? false),
              title: const Text('Clean & Organized'),
              activeColor: const Color(0xFF1F5FF8),
            ),
            CheckboxListTile(
              value: likesGuests,
              onChanged: (val) => setState(() => likesGuests = val ?? false),
              title: const Text('Likes to have guests'),
              activeColor: const Color(0xFF1F5FF8),
            ),
            CheckboxListTile(
              value: isSmoker,
              onChanged: (val) => setState(() => isSmoker = val ?? false),
              title: const Text('Smoker'),
              activeColor: const Color(0xFF1F5FF8),
            ),
            CheckboxListTile(
              value: hasPets,
              onChanged: (val) => setState(() => hasPets = val ?? false),
              title: const Text('Has pets'),
              activeColor: const Color(0xFF1F5FF8),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1F5FF8),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: isLoading ? null : submitProfile,
                child: isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text('Continue', style: TextStyle(fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<Map<String, String>> profiles = [
    {
      'name': 'Alex, 24',
      'desc': 'Loves music, clean, non-smoker',
      'image': '',
    },
    {
      'name': 'Priya, 27',
      'desc': 'Early riser, vegetarian, pet-friendly',
      'image': '',
    },
    {
      'name': 'Sam, 22',
      'desc': 'Night owl, gamer, tidy',
      'image': '',
    },
    {
      'name': 'Maya, 29',
      'desc': 'Yoga, remote worker, likes guests',
      'image': '',
    },
  ];

  int topIndex = 0;

  void onCardSwiped() {
    setState(() {
      if (topIndex < profiles.length - 1) {
        topIndex++;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('RoomieMatch'),
        centerTitle: true,
      ),
      body: Center(
        child: SizedBox(
          width: 340,
          height: 520,
          child: Stack(
            alignment: Alignment.center,
            children: List.generate(
              profiles.length - topIndex,
              (i) {
                final profile = profiles[topIndex + i];
                return Positioned(
                  top: i * 8.0,
                  child: SwipeCard(
                    key: ValueKey('${profile['name']}_$i'),
                    onSwiped: i == 0 ? onCardSwiped : null,
                    child: CardContent(
                      name: profile['name']!,
                      desc: profile['desc']!,
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}

class SwipeCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onSwiped;
  const SwipeCard({super.key, required this.child, this.onSwiped});

  @override
  State<SwipeCard> createState() => _SwipeCardState();
}

class _SwipeCardState extends State<SwipeCard> with SingleTickerProviderStateMixin {
  Offset position = Offset.zero;
  late AnimationController _controller;
  late Animation<Offset> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 300));
    _animation = Tween<Offset>(begin: Offset.zero, end: Offset.zero).animate(_controller);
    _controller.addListener(() {
      setState(() {
        position = _animation.value;
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void animateOffScreen(Offset endOffset) {
    _animation = Tween<Offset>(begin: position, end: endOffset).animate(_controller);
    _controller.forward(from: 0).then((_) {
      if (endOffset.dx.abs() > 100 && widget.onSwiped != null) {
        widget.onSwiped!();
      }
      setState(() {
        position = Offset.zero;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanUpdate: (details) {
        setState(() {
          position += details.delta;
        });
      },
      onPanEnd: (details) {
        if (position.dx > 120) {
          animateOffScreen(const Offset(500, 0)); // Swiped right
        } else if (position.dx < -120) {
          animateOffScreen(const Offset(-500, 0)); // Swiped left
        } else {
          animateOffScreen(Offset.zero); // Return to center
        }
      },
      child: Transform.translate(
        offset: position,
        child: widget.child,
      ),
    );
  }
}

class CardContent extends StatelessWidget {
  final String name;
  final String desc;
  const CardContent({super.key, required this.name, required this.desc});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 320,
      height: 480,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
        border: Border.all(color: const Color(0xFF1F5FF8), width: 2),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.person, size: 100, color: const Color(0xFF1F5FF8)),
          const SizedBox(height: 24),
          Text(
            name,
            style: Theme.of(context).textTheme.headlineMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            desc,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          const Text(
            'Swipe left or right to match!\n(Design inspired by Tinder Figma)',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
