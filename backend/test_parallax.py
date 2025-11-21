#!/usr/bin/env python3
"""
AEGIS Parallax Connection Test
==============================
Run this to verify Parallax is installed and accessible
"""

import sys
import httpx
from rich.console import Console
from rich.table import Table

console = Console()

def test_parallax_connection():
    """Test connection to Parallax node"""
    console.print("\n[bold blue]🔍 Testing Parallax Connection...[/bold blue]\n")

    parallax_urls = [
        "http://localhost:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3001"
    ]

    results = Table(title="Parallax Connection Test")
    results.add_column("Endpoint", style="cyan")
    results.add_column("Status", style="magenta")
    results.add_column("Details", style="green")

    connected = False
    working_url = None

    for base_url in parallax_urls:
        try:
            # Test health endpoint
            response = httpx.get(f"{base_url}/health", timeout=2)

            if response.status_code == 200:
                results.add_row(f"{base_url}/health", "✓ Connected", "Healthy")
                connected = True
                working_url = base_url
            else:
                results.add_row(f"{base_url}/health", "✗ Failed", f"Status: {response.status_code}")

        except httpx.ConnectError:
            results.add_row(f"{base_url}/health", "✗ Failed", "Connection refused")
        except httpx.TimeoutException:
            results.add_row(f"{base_url}/health", "✗ Failed", "Timeout")
        except Exception as e:
            results.add_row(f"{base_url}/health", "✗ Failed", str(e)[:40])

    console.print(results)
    console.print()

    if connected:
        console.print(f"[bold green]✓ Parallax is running at {working_url}[/bold green]")
        console.print(f"\n[yellow]Next steps:[/yellow]")
        console.print("1. Visit the Parallax UI: [cyan]http://localhost:3001[/cyan]")
        console.print("2. Ensure these models are downloaded:")
        console.print("   • [cyan]vikhyatk/moondream2[/cyan] (Vision)")
        console.print("   • [cyan]meta-llama/Llama-3.2-3B-Instruct[/cyan] (Reasoning)")
        console.print("\n3. Enable real AI in vision_sentinel.py:")
        console.print("   [dim]config.VISION_MODEL = 'moondream'[/dim]")
        console.print("   [dim]config.PARALLAX_ENABLED = True[/dim]")
        return True
    else:
        console.print("[bold red]✗ Parallax not detected[/bold red]")
        console.print("\n[yellow]To install Parallax:[/yellow]")
        console.print("1. Visit: [cyan]https://github.com/GradientHQ/parallax[/cyan]")
        console.print("2. Follow installation for macOS")
        console.print("3. Run: [cyan]parallax run[/cyan]")
        console.print("4. Re-run this test")
        return False

def test_openai_api():
    """Test OpenAI-compatible API access"""
    console.print("\n[bold blue]🔍 Testing OpenAI API Access...[/bold blue]\n")

    try:
        from openai import OpenAI
        client = OpenAI(
            base_url="http://localhost:3001/v1",
            api_key="not-needed-for-local"
        )

        # Try to list models
        try:
            models = client.models.list()
            console.print("[green]✓ OpenAI API accessible[/green]")

            if models.data:
                table = Table(title="Available Models")
                table.add_column("Model ID", style="cyan")

                for model in models.data:
                    table.add_row(model.id)

                console.print(table)
                return True
            else:
                console.print("[yellow]⚠ No models found. Download models via Parallax UI.[/yellow]")
                return False

        except Exception as e:
            console.print(f"[yellow]⚠ API error: {e}[/yellow]")
            return False

    except ImportError:
        console.print("[red]✗ OpenAI package not installed[/red]")
        console.print("Install: [cyan]pip install openai[/cyan]")
        return False

def main():
    """Run all tests"""
    console.print("[bold]=" * 50)
    console.print("🛡️  AEGIS Parallax Integration Test")
    console.print("=" * 50)

    # Test 1: Parallax connection
    parallax_ok = test_parallax_connection()

    if parallax_ok:
        # Test 2: OpenAI API
        api_ok = test_openai_api()

        if api_ok:
            console.print("\n[bold green]✓ ALL TESTS PASSED[/bold green]")
            console.print("\n[yellow]You're ready to run AEGIS with real AI![/yellow]")
            console.print("Run: [cyan]python vision_sentinel.py[/cyan]\n")
            sys.exit(0)

    console.print("\n[bold red]⚠ Some tests failed[/bold red]")
    console.print("Follow the instructions above to fix issues.\n")
    sys.exit(1)

if __name__ == "__main__":
    main()
